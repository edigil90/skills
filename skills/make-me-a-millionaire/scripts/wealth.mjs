#!/usr/bin/env node
// The baseline: how long a million takes with what you have and what you add each month.
//
//   node wealth.mjs --have 5000 --monthly 200 --years 10 --currency EUR
//   node wealth.mjs --have 5000 --monthly 200 --years 10 --currency EUR --json   (the numbers for the plan page)
//
// Returns compound monthly. The target defaults to a million in the same currency.

const HELP = `Usage: node wealth.mjs --have <n> --monthly <n> [--years <n>] [--currency <code>] [--target <n>] [--coffee <price>] [--json]`;

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (key === '--help' || key === '-h') { console.log(HELP); process.exit(0); }
  if (key === '--json') { args.json = true; continue; }
  if (!key.startsWith('--')) fail(`unexpected argument ${key}`);
  args[key.slice(2)] = process.argv[++i];
}

function fail(message) {
  console.error(`wealth.mjs: ${message}\n\n${HELP}`);
  process.exit(1);
}

const number = (name, fallback) => {
  if (args[name] === undefined) {
    if (fallback === undefined) fail(`--${name} is required`);
    return fallback;
  }
  const n = Number(args[name]);
  if (!Number.isFinite(n) || n < 0) fail(`--${name} must be a number of 0 or more`);
  return n;
};

const have = number('have');
const monthly = number('monthly');
const years = number('years', 10);
const target = number('target', 1_000_000);
const coffee = number('coffee', 3);
const currency = args.currency ?? 'EUR';
const thisYear = new Date().getFullYear();

const money = (n) => `${Math.round(n).toLocaleString('en-US')} ${currency}`;
const monthlyRate = (annual) => (1 + annual) ** (1 / 12) - 1;

// Months until the balance reaches the target, or Infinity when it never does.
function monthsToTarget(annual, extra = 0) {
  const add = monthly + extra;
  if (have >= target) return 0;
  const r = monthlyRate(annual);
  if (r === 0) return add > 0 ? Math.ceil((target - have) / add) : Infinity;
  if (have === 0 && add === 0) return Infinity;
  return Math.ceil(Math.log((target * r + add) / (have * r + add)) / Math.log(1 + r));
}

function duration(months) {
  if (!Number.isFinite(months)) return 'never';
  if (months === 0) return 'already there';
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y >= 1000) return `${y.toLocaleString('en-US')} years`;
  const parts = [];
  if (y) parts.push(`${y} year${y === 1 ? '' : 's'}`);
  if (m) parts.push(`${m} month${m === 1 ? '' : 's'}`);
  return parts.join(', ');
}

const arrives = (months) => (Number.isFinite(months) ? (thisYear + Math.ceil(months / 12)).toLocaleString('en-US').replace(/^(\d),(\d{3})$/, '$1$2') : '—');

function monthlyNeeded(annual, inYears) {
  const n = Math.round(inYears * 12);
  const r = monthlyRate(annual);
  const grown = have * (1 + r) ** n;
  if (grown >= target) return 0;
  return r === 0 ? (target - grown) / n : ((target - grown) * r) / ((1 + r) ** n - 1);
}

const rows = [
  ['0%, under the mattress', 0],
  ['4%, a savings account', 0.04],
  ['7%, a broad index fund', 0.07],
  ['10%, a very good decade', 0.1],
];

const intro = `Target: ${money(target)}. Starting with ${money(have)} and adding ${money(monthly)} a month.`;
const table = rows.map(([label, rate]) => {
  const months = monthsToTarget(rate);
  return { return: label, time: duration(months), arrives: arrives(months) };
});
const latte = monthsToTarget(0.07, coffee * 30);
const notes = [
  `Skipping one ${money(coffee)} coffee a day (+${money(coffee * 30)} a month) at 7%: ${duration(latte)}, arriving ${arrives(latte)}.`,
  `To arrive in ${years} years at 7%: ${money(monthlyNeeded(0.07, years))} a month.`,
  'Returns are after inflation, before tax and fees, and never guaranteed.',
];

if (args.json) {
  console.log(JSON.stringify({ intro, rows: table, notes, arrivesAt7: arrives(monthsToTarget(0.07)) }, null, 2));
  process.exit(0);
}

console.log(intro);
console.log();
console.log('| Annual return | Time to the target | Arrives |');
console.log('| --- | --- | --- |');
for (const row of table) console.log(`| ${row.return} | ${row.time} | ${row.arrives} |`);
console.log();
for (const note of notes) console.log(note);
