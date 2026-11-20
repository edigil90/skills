#!/usr/bin/env node
// Reads the signals the forecast stands on, from this machine only, and prints them as JSON.
// Nothing is sent anywhere. A signal that can't be read is null.
//
//   node signals.mjs

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import os from 'node:os';

const run = (command, args) => {
  try {
    return execFileSync(command, args, { encoding: 'utf8', timeout: 3000, stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
};

function battery() {
  if (process.platform === 'darwin') {
    const text = run('pmset', ['-g', 'batt']);
    const match = text?.match(/(\d+)%;\s*([^;]+);\s*([^\s]+)?/);
    if (!match) return null;
    return { percent: Number(match[1]), state: match[2].trim(), remaining: /^\d+:\d+$/.test(match[3] ?? '') ? match[3] : null };
  }
  if (process.platform === 'linux') {
    try {
      const dir = readdirSync('/sys/class/power_supply').find((name) => name.startsWith('BAT'));
      if (!dir) return null;
      const read = (file) => readFileSync(`/sys/class/power_supply/${dir}/${file}`, 'utf8').trim();
      return { percent: Number(read('capacity')), state: read('status').toLowerCase(), remaining: null };
    } catch {
      return null;
    }
  }
  return null;
}

function git() {
  if (run('git', ['rev-parse', '--is-inside-work-tree']) !== 'true') return null;
  const last = Number(run('git', ['log', '-1', '--format=%ct']));
  const status = run('git', ['status', '--porcelain']);
  const today = run('git', ['rev-list', '--count', '--since=24.hours', 'HEAD']);
  return {
    branch: run('git', ['branch', '--show-current']) || null,
    uncommittedFiles: status === null ? null : status.split('\n').filter(Boolean).length,
    hoursSinceLastCommit: last ? Math.round(((Date.now() / 1000 - last) / 3600) * 10) / 10 : null,
    commitsInLast24Hours: today === null ? null : Number(today),
  };
}

const now = new Date();
const startOfYear = new Date(now.getFullYear(), 0, 1);
const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
const day = 24 * 3600 * 1000;
const weekday = now.getDay();

console.log(JSON.stringify({
  readAt: now.toString(),
  time: {
    weekday: now.toLocaleDateString('en-US', { weekday: 'long' }),
    hour: now.getHours(),
    minute: now.getMinutes(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dayOfYear: Math.floor((now - startOfYear) / day) + 1,
    daysLeftInYear: Math.ceil((endOfYear - now) / day),
    daysUntilSaturday: weekday === 6 ? 0 : 6 - weekday,
  },
  battery: battery(),
  uptimeHours: Math.round((os.uptime() / 3600) * 10) / 10,
  git: git(),
  system: {
    platform: process.platform,
    cpus: os.cpus().length,
    memoryUsedPercent: Math.round((1 - os.freemem() / os.totalmem()) * 100),
    load: Math.round(os.loadavg()[0] * 100) / 100,
    terminal: process.env.TERM_PROGRAM ?? null,
  },
}, null, 2));
