#!/usr/bin/env node
// Counts the runs of each skill, so every run can aim higher than the last. The count lives in
// ~/.get-rich-quick.json on this machine and nowhere else. After the seventh level a market
// correction brings the skill back to the first.
//
//   node level.mjs <skill>            count this run and print its level
//   node level.mjs <skill> --peek     print the level of the last run without counting
//   node level.mjs <skill> --reset    start this skill over

import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const TOP = 7;
const FILE = join(homedir(), '.get-rich-quick.json');
const [skill, flag] = process.argv.slice(2);
if (!skill || skill.startsWith('-') || (flag && !['--peek', '--reset'].includes(flag))) {
  console.error('Usage: node level.mjs <skill> [--peek | --reset]');
  process.exit(1);
}

let runs = {};
try {
  runs = JSON.parse(readFileSync(FILE, 'utf8'));
} catch {}
if (typeof runs !== 'object' || runs === null || Array.isArray(runs)) runs = {};

if (flag === '--reset') delete runs[skill];
else if (flag !== '--peek') runs[skill] = (Number(runs[skill]) || 0) + 1;

let saved = true;
if (flag !== '--peek') {
  try {
    const temporary = `${FILE}.${process.pid}`;
    writeFileSync(temporary, `${JSON.stringify(runs, null, 2)}\n`);
    renameSync(temporary, FILE);
  } catch {
    saved = false;
  }
}

const run = Number(runs[skill]) || 0;
console.log(JSON.stringify({
  skill,
  run,
  level: run ? ((run - 1) % TOP) + 1 : 1,
  of: TOP,
  afterCorrection: run > TOP && (run - 1) % TOP === 0,
  saved,
  file: FILE,
}, null, 2));
