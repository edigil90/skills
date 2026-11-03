#!/usr/bin/env node
// Checks that every skill in skills/ loads in every agent that reads the Agent Skills format.
//
// A SKILL.md whose frontmatter fails a strict YAML parse is dropped silently by some agents. Its keys
// are the six the specification defines, plus `disable-model-invocation`, Claude Code's switch for a
// skill only the user starts; Codex reads the same switch from agents/openai.yaml, so the two must
// agree. This check parses each SKILL.md the strict way, checks the fields, the files SKILL.md links
// to, the Claude and Codex plugin manifests and each skill's agents/openai.yaml, and that the version
// is the same wherever it is written: a plugin update compares it and nothing else.
//
//   npm install --no-save --no-package-lock yaml@2.6.1   (once)
//   node tests/frontmatter.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

let YAML;
try {
  YAML = await import('yaml');
} catch {
  console.error('This check needs the "yaml" package: npm install --no-save --no-package-lock yaml@2.6.1');
  process.exit(2);
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = join(ROOT, 'skills');
const ALLOWED_KEYS = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools', 'disable-model-invocation'];
const problems = [];
const report = (where, message) => problems.push(`${where}: ${message}`);

function parseStrict(text, where) {
  const doc = YAML.parseDocument(text, { strict: true, uniqueKeys: true, prettyErrors: true });
  for (const issue of [...doc.errors, ...doc.warnings]) report(where, `YAML ${issue.name}: ${issue.message.split('\n')[0]}`);
  return doc.errors.length ? null : doc.toJS();
}

function checkFields(fields, dir, where) {
  for (const key of Object.keys(fields)) {
    if (!ALLOWED_KEYS.includes(key)) report(where, `"${key}" is not one of ${ALLOWED_KEYS.join(', ')}`);
  }
  const { name, description, compatibility, metadata } = fields;
  if ('disable-model-invocation' in fields && typeof fields['disable-model-invocation'] !== 'boolean') {
    report(where, 'disable-model-invocation must be true or false');
  }
  if (typeof name !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    report(where, `name must be lower-case words joined by single hyphens, 64 characters at most (got ${JSON.stringify(name)})`);
  } else if (name !== dir) {
    report(where, `name "${name}" must match its folder "${dir}"`);
  }
  if (typeof description !== 'string' || !description.trim()) report(where, 'description must be a non-empty string');
  else if (description.length > 1024) report(where, `description is ${description.length} characters; the limit is 1024`);
  if (compatibility !== undefined && (typeof compatibility !== 'string' || compatibility.length > 500)) {
    report(where, 'compatibility must be a string of 500 characters at most');
  }
  if (metadata !== undefined) {
    if (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata)) report(where, 'metadata must be a map');
    else for (const [key, value] of Object.entries(metadata)) {
      if (typeof value !== 'string') report(where, `metadata.${key} must be a string (quote it)`);
    }
  }
}

function checkLinkedFiles(body, skillDir, where) {
  const linked = new Set([...body.matchAll(/\]\((?!https?:|#)([^)\s#]+)/g)].map((match) => match[1]));
  for (const path of linked) {
    if (!existsSync(join(skillDir, path))) report(where, `points to ${path}, which does not exist`);
  }
  return linked.size;
}

const names = new Map();
const userOnly = new Map();
const versions = new Map();
let linkedCount = 0;
for (const dir of readdirSync(SKILLS)) {
  const skillDir = join(SKILLS, dir);
  const file = join(skillDir, 'SKILL.md');
  if (!statSync(skillDir).isDirectory() || !existsSync(file)) continue;
  const where = `skills/${dir}/SKILL.md`;
  const source = readFileSync(file, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    report(where, 'no frontmatter block (--- … ---) at the top');
    continue;
  }
  const fields = parseStrict(match[1], where);
  if (!fields) continue;
  checkFields(fields, dir, where);
  userOnly.set(dir, fields['disable-model-invocation'] === true);
  if (fields.metadata?.version) versions.set(where, fields.metadata.version);
  if (fields.name) {
    if (names.has(fields.name)) report(where, `name "${fields.name}" is also used by ${names.get(fields.name)}`);
    else names.set(fields.name, where);
  }
  const lines = source.split('\n').length;
  if (lines > 500) report(where, `${lines} lines; keep SKILL.md under 500 and move detail to files beside it`);
  linkedCount += checkLinkedFiles(match[2], skillDir, where);
}
if (!names.size) report('skills/', 'no SKILL.md found');

const manifest = join(ROOT, '.claude-plugin', 'marketplace.json');
if (existsSync(manifest)) {
  let json;
  try {
    json = JSON.parse(readFileSync(manifest, 'utf8'));
  } catch (error) {
    report('.claude-plugin/marketplace.json', `invalid JSON: ${error.message}`);
  }
  for (const plugin of json?.plugins ?? []) {
    for (const path of [].concat(plugin.skills ?? [])) {
      if (!existsSync(join(ROOT, path, 'SKILL.md'))) report('.claude-plugin/marketplace.json', `plugin "${plugin.name}" lists ${path}, which has no SKILL.md`);
    }
    if (plugin.version) versions.set('.claude-plugin/marketplace.json', plugin.version);
  }
}

// Codex: each skill's agents/openai.yaml parses the strict way, and the plugin manifest and its
// marketplace name the Claude plugin's name and point at real skills.
const readJson = (path) => {
  try { return JSON.parse(readFileSync(join(ROOT, path), 'utf8')); } catch (error) { report(path, `invalid JSON: ${error.message}`); return null; }
};
for (const dir of names.keys()) {
  const path = `skills/${dir}/agents/openai.yaml`;
  if (!existsSync(join(ROOT, path))) continue;
  const yaml = parseStrict(readFileSync(join(ROOT, path), 'utf8'), path);
  for (const key of ['display_name', 'short_description']) if (yaml && typeof yaml.interface?.[key] !== 'string') report(path, `interface.${key} must be a string`);
  const implicit = yaml?.policy?.allow_implicit_invocation ?? true;
  if (yaml && implicit === userOnly.get(dir)) report(path, `policy.allow_implicit_invocation is ${implicit}, but SKILL.md says disable-model-invocation: ${userOnly.get(dir)}; set them together`);
}
if (existsSync(join(ROOT, '.codex-plugin', 'plugin.json'))) {
  const codex = readJson('.codex-plugin/plugin.json');
  const claude = existsSync(manifest) ? readJson('.claude-plugin/marketplace.json') : null;
  if (codex && claude && !claude.plugins?.some((p) => p.name === codex.name)) report('.codex-plugin/plugin.json', `name "${codex.name}" is not the Claude plugin's`);
  if (codex && ![...names.keys()].every((dir) => existsSync(join(ROOT, codex.skills ?? '', dir, 'SKILL.md')))) report('.codex-plugin/plugin.json', `skills "${codex.skills}" doesn't hold every skill`);
  const market = readJson('.agents/plugins/marketplace.json');
  if (codex && !market?.plugins?.some((p) => p.name === codex.name)) report('.agents/plugins/marketplace.json', `lists no plugin "${codex?.name}"`);
  if (codex?.version) versions.set('.codex-plugin/plugin.json', codex.version);
}
if (new Set(versions.values()).size > 1) report('version', `not the same everywhere: ${[...versions].map(([where, v]) => `${where} ${v}`).join(', ')}`);

if (problems.length) {
  console.error(`not ok - ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log(`ok - ${names.size} skill(s): frontmatter parses strictly, only known fields, ${linkedCount} linked file(s) exist, the Claude and Codex manifests point at real skills, version ${[...new Set(versions.values())].join(', ') || 'unset'} everywhere`);
