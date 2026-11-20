#!/usr/bin/env node
// The financial model: the monthly growth that turns the first subscription into a billion-dollar run
// rate, and the hockey stick it draws.
//
//   node model.mjs --price 9 --months 60
//   node model.mjs --price 9 --months 60 --json     (the numbers for the deck)

const HELP = `Usage: node model.mjs [--price <monthly price, default 9>] [--months <n, default 60>] [--target <ARR, default 1000000000>] [--json]`;

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (key === '--help' || key === '-h') { console.log(HELP); process.exit(0); }
  if (key === '--json') { args.json = true; continue; }
  if (!key.startsWith('--')) fail(`unexpected argument ${key}`);
  args[key.slice(2)] = process.argv[++i];
}

function fail(message) {
  console.error(`model.mjs: ${message}\n\n${HELP}`);
  process.exit(1);
}

const number = (name, fallback) => {
  if (args[name] === undefined) return fallback;
  const n = Number(args[name]);
  if (!Number.isFinite(n) || n <= 0) fail(`--${name} must be a number above 0`);
  return n;
};

const price = number('price', 9);
const months = Math.round(number('months', 60));
const target = number('target', 1_000_000_000);
if (months < 13) fail('--months must be 13 or more');

// Month 1 is one customer. Month `months` is a run rate of `target` a year.
const lastMonthly = target / 12;
const growth = (lastMonthly / price) ** (1 / (months - 1)) - 1;
const monthly = Array.from({ length: months }, (_, i) => price * (1 + growth) ** i);
const years = Array.from({ length: Math.ceil(months / 12) }, (_, y) => {
  const slice = monthly.slice(y * 12, y * 12 + 12);
  const end = slice.at(-1);
  return { year: y + 1, revenue: slice.reduce((a, b) => a + b, 0), arr: end * 12, customers: Math.round(end / price) };
});

const usd = (value) => {
  // Rounded first, so 999,999,999.97 reads as $1B and not $1000M.
  const n = Number(value.toPrecision(4));
  if (n >= 1e15) return `$${(n / 1e15).toFixed(2).replace(/\.?0+$/, '')} quadrillion`;
  if (n >= 1e12) return `$${(n / 1e12).toFixed(n >= 1e13 ? 0 : 1).replace(/\.0$/, '')}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(n >= 1e10 ? 0 : 1).replace(/\.0$/, '')}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return `$${Math.round(n)}`;
};

if (args.json) {
  console.log(JSON.stringify({ price, months, growth, target, monthly: monthly.map((n) => Math.round(n)), years }, null, 2));
  process.exit(0);
}

console.log(`Month 1: one customer at ${usd(price)} a month.`);
console.log(`Required growth: ${(growth * 100).toFixed(1)}% month over month, for ${months - 1} consecutive months.`);
const lastCustomers = Math.round(lastMonthly / price);
console.log(`Month ${months}: ${lastCustomers.toLocaleString('en-US')} customers, a ${usd(target)} annual run rate.`);
// About 8.2 billion people, by the UN's 2024 estimate.
if (lastCustomers > 8.2e9) console.log(`That is ${Math.round(lastCustomers / 8.2e9).toLocaleString('en-US')} customers for every person on Earth.`);
console.log();
console.log('| Year | Revenue | Run rate at year end | Customers | Employees |');
console.log('| --- | --- | --- | --- | --- |');
for (const y of years) console.log(`| ${y.year} | ${usd(y.revenue)} | ${usd(y.arr)} | ${y.customers.toLocaleString('en-US')} | 0 |`);
console.log();

// The hockey stick: one column a month, on a linear scale, so the first four years lie flat.
const rows = 12;
const top = Math.max(...monthly);
const label = (text) => text.padStart(6);
console.log('```');
for (let r = rows; r >= 1; r--) {
  const threshold = (top * (r - 0.5)) / rows;
  const axis = r === rows ? label(usd(target / 12)) : r === 1 ? label('$0') : label('');
  console.log(`${axis} │${monthly.map((n) => (n >= threshold ? '█' : ' ')).join('')}`);
}
console.log(`${label('')} └${'─'.repeat(months)}`);
console.log(`${label('')}  ${years.map((y) => `Y${y.year}`.padEnd(12)).join('').slice(0, months)}`);
console.log(`${label('')}  Monthly revenue`);
console.log('```');
console.log();
console.log(`Revenue today: $0. Valuation today: ${usd(target)}, at one times the run rate of month ${months}.`);
