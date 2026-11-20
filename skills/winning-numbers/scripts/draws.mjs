#!/usr/bin/env node
// Analyses a lottery's draw history, backtests the usual strategies and picks the ticket the fewest
// people play.
//
//   node draws.mjs --game loto-7-39 --history draws.txt --price 100 --currency RSD --payout 0.5
//
// The history file holds one draw per line, oldest first: the main numbers, then optionally "|" and
// the bonus numbers. A date at the start of a line ("2026-11-18") is kept; lines starting with # are
// skipped. Without --history it runs the simulation alone.

import { readFileSync } from 'node:fs';

const GAMES = {
  'loto-7-39': { name: 'Loto 7/39', pick: 7, of: 39 },
  eurojackpot: { name: 'Eurojackpot', pick: 5, of: 50, bonusPick: 2, bonusOf: 12 },
  euromillions: { name: 'EuroMillions', pick: 5, of: 50, bonusPick: 2, bonusOf: 12 },
  powerball: { name: 'Powerball', pick: 5, of: 69, bonusPick: 1, bonusOf: 26 },
  'mega-millions': { name: 'Mega Millions', pick: 5, of: 70, bonusPick: 1, bonusOf: 24 },
  'uk-lotto': { name: 'UK Lotto', pick: 6, of: 59 },
};

const HELP = `Usage: node draws.mjs --game <id> [options]
       node draws.mjs --name <name> --pick <n> --of <n> [--bonus-pick <n> --bonus-of <n>] [options]

Games: ${Object.keys(GAMES).join(', ')}

Options:
  --history <file>   draws, one per line, oldest first: "3 7 12 19 25 33 38" or "… | 4 9"
  --sims <n>         simulated draws (default 10000000)
  --price <n>        price of one combination
  --tickets <n|all>  combinations to buy (default 1)
  --currency <code>  currency of the price (default EUR)
  --payout <share>   share of sales paid back as prizes (default 0.5)
  --seed <n>         seed for the simulation (default: the clock)`;

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const key = process.argv[i];
  if (key === '--help' || key === '-h') { console.log(HELP); process.exit(0); }
  if (!key.startsWith('--')) fail(`unexpected argument ${key}`);
  args[key.slice(2)] = process.argv[++i];
}

function fail(message) {
  console.error(`draws.mjs: ${message}\n\n${HELP}`);
  process.exit(1);
}

const int = (value, name) => {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) fail(`--${name} must be a whole number`);
  return n;
};

const preset = args.game ? GAMES[args.game] : {};
if (args.game && !preset) fail(`unknown game "${args.game}"`);
const game = {
  name: args.name ?? preset.name ?? 'Lottery',
  pick: args.pick ? int(args.pick, 'pick') : preset.pick,
  of: args.of ? int(args.of, 'of') : preset.of,
  bonusPick: args['bonus-pick'] ? int(args['bonus-pick'], 'bonus-pick') : preset.bonusPick ?? 0,
  bonusOf: args['bonus-of'] ? int(args['bonus-of'], 'bonus-of') : preset.bonusOf ?? 0,
};
if (!game.pick || !game.of || game.pick >= game.of) fail('the game needs --pick smaller than --of');
if (game.bonusPick && game.bonusPick >= game.bonusOf) fail('--bonus-pick must be smaller than --bonus-of');

const sims = args.sims ? int(args.sims, 'sims') : 10_000_000;
const price = args.price !== undefined ? Number(args.price) : null;
const currency = args.currency ?? 'EUR';
const payout = args.payout !== undefined ? Number(args.payout) : 0.5;
const seed = args.seed ? int(args.seed, 'seed') : Date.now() % 2 ** 31;

// --- Draw history

const draws = [];
let skipped = 0;
if (args.history) {
  for (const raw of readFileSync(args.history, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const date = line.match(/^(\d{4}-\d{2}-\d{2})[\s:,;]+/);
    const [mainPart, bonusPart = ''] = line.slice(date ? date[0].length : 0).split('|');
    const main = mainPart.split(/[\s,;]+/).filter(Boolean).map(Number);
    const bonus = bonusPart.split(/[\s,;]+/).filter(Boolean).map(Number);
    const valid =
      main.length === game.pick &&
      new Set(main).size === game.pick &&
      main.every((n) => Number.isInteger(n) && n >= 1 && n <= game.of) &&
      (!bonus.length || (bonus.length === game.bonusPick && bonus.every((n) => Number.isInteger(n) && n >= 1 && n <= game.bonusOf)));
    if (valid) draws.push({ date: date?.[1], main, bonus });
    else skipped++;
  }
  if (!draws.length) fail(`no draw in ${args.history} has ${game.pick} numbers from 1 to ${game.of}`);
  if (skipped > draws.length / 10) fail(`${skipped} of ${skipped + draws.length} lines are not draws of ${game.name}; check the file`);
}

// --- Maths

function choose(n, k) {
  let result = 1;
  for (let i = 1; i <= k; i++) result = (result * (n - k + i)) / i;
  return Math.round(result);
}

function lnGamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x;
  const tmp = x + 5.5 - (x + 0.5) * Math.log(x + 5.5);
  let ser = 1.000000000190015;
  for (const value of c) ser += value / ++y;
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

// The upper regularized gamma function Q(a, x), which gives a chi-square test its p-value.
function gammaQ(a, x) {
  if (x <= 0) return 1;
  if (x < a + 1) {
    let sum = 1 / a;
    let term = sum;
    for (let n = 1; n < 500; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-14) break;
    }
    return 1 - sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
  }
  let b = x + 1 - a;
  let c = 1 / 1e-300;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-14) break;
  }
  return Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h;
}

function random(seedValue) {
  let s = seedValue >>> 0;
  const next = () => {
    s = (s + 0x9e3779b9) | 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    return (z ^ (z >>> 16)) >>> 0;
  };
  let a = next(), b = next(), c = next(), d = next();
  return () => {
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

const rand = random(seed);
const pickFrom = (count, of) => {
  const pool = Array.from({ length: of }, (_, i) => i + 1);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rand() * (of - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((x, y) => x - y);
};

const fmt = (n) => Math.round(n).toLocaleString('en-US');
const pct = (p, digits = 2) => `${(p * 100).toFixed(digits)}%`;
const smallPercent = (p) => {
  const value = p * 100;
  if (value >= 0.01) return `${value.toFixed(2)}%`;
  return `${value.toFixed(Math.ceil(-Math.log10(value)) + 1)}%`;
};
const two = (n) => String(n).padStart(2, '0');
const ticketText = (t) => t.main.map(two).join(' ') + (t.bonus.length ? ` + ${t.bonus.map(two).join(' ')}` : '');

const combinations = choose(game.of, game.pick) * (game.bonusPick ? choose(game.bonusOf, game.bonusPick) : 1);
const jackpotOdds = 1 / combinations;
const matchOdds = (k) => (choose(game.pick, k) * choose(game.of - game.pick, game.pick - k)) / choose(game.of, game.pick);
const tickets = args.tickets === 'all' ? combinations : Math.min(combinations, args.tickets ? int(args.tickets, 'tickets') || 1 : 1);
const allCovered = tickets === combinations;
const threePlus = Array.from({ length: game.pick - 2 }, (_, i) => matchOdds(i + 3)).reduce((a, b) => a + b, 0);

const out = [];
const say = (line = '') => out.push(line);

say(`# ${game.name}: ${game.pick} of ${game.of}${game.bonusPick ? ` + ${game.bonusPick} of ${game.bonusOf}` : ''}`);
say();

// --- Patterns in the history

const strategies = [];
const counts = new Array(game.of + 1).fill(0);
const bonusCounts = new Array(game.bonusOf + 1).fill(0);
const lastSeen = new Array(game.of + 1).fill(-1);

if (draws.length) {
  const n = draws.length;
  draws.forEach((draw, index) => {
    for (const x of draw.main) { counts[x]++; lastSeen[x] = index; }
    for (const x of draw.bonus) bonusCounts[x]++;
  });
  const p = game.pick / game.of;
  const expected = n * p;
  const numbers = Array.from({ length: game.of }, (_, i) => i + 1);
  const byCount = [...numbers].sort((a, b) => counts[b] - counts[a] || a - b);
  const gap = (x) => (lastSeen[x] < 0 ? n : n - 1 - lastSeen[x]);
  const byGap = [...numbers].sort((a, b) => gap(b) - gap(a) || a - b);
  const bonusNumbers = Array.from({ length: game.bonusOf }, (_, i) => i + 1);
  const bonusBy = (dir) => [...bonusNumbers].sort((a, b) => dir * (bonusCounts[b] - bonusCounts[a]) || a - b);
  const hasBonus = game.bonusPick > 0 && draws.some((d) => d.bonus.length);

  const dated = draws.filter((d) => d.date);
  say('## Data');
  say(`Draws: ${fmt(n)}${dated.length ? `, from ${dated[0].date} to ${dated.at(-1).date}` : ''}`);
  if (skipped) say(`Lines skipped: ${skipped}`);
  say();

  say('## Patterns');
  say(`Expected appearances per number: ${expected.toFixed(1)}`);
  say(`Hot: ${byCount.slice(0, game.pick).map((x) => `${x} (${counts[x]})`).join(', ')}`);
  say(`Cold: ${byCount.slice(-game.pick).reverse().map((x) => `${x} (${counts[x]})`).join(', ')}`);
  say(`Overdue: ${byGap.slice(0, 5).map((x) => `${x} (${gap(x)} draws)`).join(', ')}`);

  const pairs = new Map();
  for (const draw of draws) {
    for (let i = 0; i < draw.main.length; i++) {
      for (let j = i + 1; j < draw.main.length; j++) {
        const [a, b] = [draw.main[i], draw.main[j]].sort((x, y) => x - y);
        const key = a * 1000 + b;
        pairs.set(key, (pairs.get(key) ?? 0) + 1);
      }
    }
  }
  const [topPair, topPairCount] = [...pairs].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
  const pairExpected = (n * game.pick * (game.pick - 1)) / (game.of * (game.of - 1));
  say(`Most frequent pair: ${Math.floor(topPair / 1000)} and ${topPair % 1000} (${topPairCount} times; ${pairExpected.toFixed(1)} expected for any pair, ${pairs.size} pairs compared)`);

  const sum = draws.reduce((a, d) => a + d.main.reduce((x, y) => x + y, 0), 0) / n;
  const odd = draws.reduce((a, d) => a + d.main.filter((x) => x % 2).length, 0) / (n * game.pick);
  say(`Average sum: ${sum.toFixed(1)} (${((game.pick * (game.of + 1)) / 2).toFixed(1)} expected)`);
  say(`Odd numbers: ${pct(odd, 1)} (${pct(Math.ceil(game.of / 2) / game.of, 1)} expected)`);
  say();

  // With fixed draws of `pick` numbers, the counts sum to n * pick, so the test is adjusted for
  // drawing without replacement and has of - 1 degrees of freedom.
  const deviation = numbers.reduce((a, x) => a + (counts[x] - expected) ** 2, 0);
  const chi = ((game.of - 1) * deviation) / (game.of * n * p * (1 - p));
  const df = game.of - 1;
  const pValue = gammaQ(df / 2, chi / 2);
  say('## Validation');
  say(`Chi-square test of uniformity: χ² = ${chi.toFixed(2)}, ${df} degrees of freedom, p = ${pValue.toFixed(2)}`);
  say(pValue < 0.01
    ? 'Verdict: the counts are uneven beyond chance. Check the history file before anything else.'
    : 'Verdict: the counts are what pure chance produces. No number is hot, cold or overdue.');
  say();

  const bonusFor = (dir) => (hasBonus ? bonusBy(dir).slice(0, game.bonusPick).sort((a, b) => a - b) : null);
  const sorted = (list) => [...list].sort((a, b) => a - b);
  strategies.push({ label: 'Hot numbers', main: sorted(byCount.slice(0, game.pick)), bonus: bonusFor(1) });
  strategies.push({ label: 'Cold numbers', main: sorted(byCount.slice(-game.pick)), bonus: bonusFor(-1) });
  strategies.push({ label: 'Overdue numbers', main: sorted(byGap.slice(0, game.pick)), bonus: bonusFor(1) });
  strategies.push({ label: 'Last draw again', main: sorted(draws.at(-1).main), bonus: hasBonus ? sorted(draws.at(-1).bonus) : null });
}

// --- The ticket the fewest people play
//
// Nothing changes the odds of winning. What changes is how many people share the jackpot, and people
// favour birthdays (1 to 31), lucky 7, patterns, sequences and last week's numbers.

const pastDraws = new Set(draws.map((d) => d.main.join('-')));
const aboveBirthdays = game.of - 31;
const wantHigh = aboveBirthdays > 0 ? Math.min(Math.ceil(game.pick / 2), aboveBirthdays) : 0;
const isProgression = (t) => {
  for (let i = 0; i < t.length; i++)
    for (let j = i + 1; j < t.length; j++)
      if (t.includes(2 * t[j] - t[i])) return true;
  return false;
};
const fewestPlay = (t) =>
  !pastDraws.has(t.join('-')) &&
  !isProgression(t) &&
  !t.includes(7) &&
  t.filter((x) => x > 31).length >= wantHigh &&
  new Set(t.map((x) => Math.floor(x / 10))).size >= Math.min(3, Math.ceil(game.pick / 2)) &&
  t.some((x) => x % 2) && t.some((x) => x % 2 === 0);
let best = null;
for (let tries = 0; tries < 1_000_000 && !best; tries++) {
  const t = pickFrom(game.pick, game.of);
  if (fewestPlay(t)) best = t;
}
best ??= pickFrom(game.pick, game.of);
const bestBonus = game.bonusPick ? pickFrom(game.bonusPick, game.bonusOf) : null;

const birthdayCap = Math.min(31, game.of);
strategies.push({ label: 'Birthdays', main: pickFrom(game.pick, birthdayCap), bonus: game.bonusPick ? pickFrom(game.bonusPick, Math.min(game.bonusOf, 12)) : null });
strategies.push({ label: `1 to ${game.pick}`, main: Array.from({ length: game.pick }, (_, i) => i + 1), bonus: game.bonusPick ? Array.from({ length: game.bonusPick }, (_, i) => i + 1) : null });
strategies.push({ label: 'Quick pick', main: null, bonus: null });
strategies.push({ label: 'Fewest players', main: best, bonus: bestBonus });
for (const s of strategies) if (s.main) s.bonus ??= game.bonusPick ? pickFrom(game.bonusPick, game.bonusOf) : [];

// --- Backtest

const mark = new Uint8Array(game.of + 1);
const bonusMark = new Uint8Array(game.bonusOf + 1);
const pool = Int32Array.from({ length: game.of }, (_, i) => i + 1);
const bonusPool = Int32Array.from({ length: game.bonusOf }, (_, i) => i + 1);
const draw = (into, from, count, of) => {
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rand() * (of - i));
    const swap = from[i]; from[i] = from[j]; from[j] = swap;
    into[from[i]] = 1;
  }
};
const clear = (into, from, count) => { for (let i = 0; i < count; i++) into[from[i]] = 0; };
const results = strategies.map(() => ({ threePlus: 0, jackpots: 0 }));
// A quick pick is a fresh shuffle of its own pool; its first `pick` entries are the ticket.
const quick = Int32Array.from({ length: game.of }, (_, i) => i + 1);
const quickBonus = Int32Array.from({ length: game.bonusOf }, (_, i) => i + 1);
const shuffle = (from, count, of) => {
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rand() * (of - i));
    const swap = from[i]; from[i] = from[j]; from[j] = swap;
  }
};
const started = Date.now();

for (let s = 0; s < sims; s++) {
  draw(mark, pool, game.pick, game.of);
  if (game.bonusPick) draw(bonusMark, bonusPool, game.bonusPick, game.bonusOf);
  for (let k = 0; k < strategies.length; k++) {
    let main = strategies[k].main;
    let bonus = strategies[k].bonus;
    if (!main) {
      shuffle(quick, game.pick, game.of);
      if (game.bonusPick) shuffle(quickBonus, game.bonusPick, game.bonusOf);
      main = quick;
      bonus = quickBonus;
    }
    let hits = 0;
    for (let i = 0; i < game.pick; i++) hits += mark[main[i]];
    if (hits >= 3) results[k].threePlus++;
    if (hits === game.pick) {
      let bonusHits = 0;
      for (let i = 0; i < game.bonusPick; i++) bonusHits += bonusMark[bonus[i]];
      if (bonusHits === game.bonusPick) results[k].jackpots++;
    }
  }
  clear(mark, pool, game.pick);
  if (game.bonusPick) clear(bonusMark, bonusPool, game.bonusPick);
}

const noise = 2 * Math.sqrt((threePlus * (1 - threePlus)) / sims);
const rates = results.map((r) => r.threePlus / sims);
say('## Backtest');
say(`Simulated draws: ${fmt(sims)} (seed ${seed}, ${((Date.now() - started) / 1000).toFixed(1)} s)`);
say();
say('| Strategy | Ticket | 3+ main numbers | Jackpots |');
say('| --- | --- | --- | --- |');
strategies.forEach((s, i) => {
  const ticket = s.main ? ticketText({ main: s.main, bonus: s.bonus ?? [] }) : 'new every draw';
  say(`| ${s.label} | ${ticket} | ${pct(rates[i], 3)} | ${fmt(results[i].jackpots)} |`);
});
const expectedJackpots = sims * jackpotOdds;
say(`| Chance alone | any | ${pct(threePlus, 3)} | ${expectedJackpots < 0.01 ? expectedJackpots.toPrecision(2) : expectedJackpots.toFixed(2)} expected |`);
say();
say(`Spread between strategies: ${((Math.max(...rates) - Math.min(...rates)) * 100).toFixed(3)} percentage points. Simulation noise: ±${(noise * 100).toFixed(3)}.`);
say();

// --- The ticket

const cost = price !== null ? price * tickets : null;
// With every combination bought, the prizes depend on what everyone else bought, so no expectation.
const loss = cost !== null && !allCovered ? cost * (1 - payout) : null;
const money = (n) => {
  const value = Math.abs(n);
  const decimals = Number.isInteger(value) ? 0 : 2;
  return `${n < 0 ? '−' : ''}${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ${currency}`;
};
const lowest = (count) => Array.from({ length: count }, (_, i) => i + 1).join(' ');
const width = 46;
const row = (text = '') => `│ ${text.padEnd(width - 2)} │`;
const center = (text) => `│${text.padStart(Math.floor((width + text.length) / 2)).padEnd(width)}│`;
const field = (label, value) => row(`${label.padEnd(17)}${value}`);
const lines = [
  `┌${'─'.repeat(width)}┐`,
  row(`${game.name.toUpperCase().padEnd(width - 2 - 'NEXT DRAW'.length)}NEXT DRAW`),
  row(),
  ...(allCovered
    ? [center(`ALL ${fmt(combinations)} COMBINATIONS`)]
    : [
        center(best.map(two).join('   ')),
        ...(bestBonus ? [center(`+   ${bestBonus.map(two).join('   ')}`)] : []),
        ...(tickets > 1 ? [center(`and ${fmt(tickets - 1)} more`)] : []),
      ]),
  row(),
  field('Model', 'winning-numbers 1.0.0'),
  ...(draws.length ? [field('Draws analysed', fmt(draws.length))] : []),
  field('Simulations', fmt(sims)),
  ...(tickets > 1 ? [field('Tickets', fmt(tickets))] : []),
  ...(tickets > 1 && cost !== null ? [field('Cost', money(cost))] : []),
  field('Odds', `1 in ${fmt(combinations / tickets)}`),
  field('Confidence', allCovered ? '100%' : smallPercent(tickets * jackpotOdds)),
  ...(loss !== null ? [field('Expected value', money(-loss))] : []),
  row(),
  ...(allCovered
    ? [row('Every combination covered.'), row('The jackpot is guaranteed.')]
    : tickets > 1
      ? [row(`Same odds as any other ${fmt(tickets)} tickets.`)]
      : [row(`Same odds as ${lowest(game.pick)}${game.bonusPick ? ` + ${lowest(game.bonusPick)}` : ''}.`)]),
  ...(cost !== null ? [row(`Not buying ${tickets > 1 ? 'them' : 'it'} returns ${money(cost)}.`)] : []),
  `└${'─'.repeat(width)}┘`,
];
say(tickets > 1 ? '## Your tickets' : '## Your ticket');
say('```');
for (const line of lines) say(line);
say('```');

console.log(out.join('\n'));
