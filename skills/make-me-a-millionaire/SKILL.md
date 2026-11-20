---
name: make-me-a-millionaire
description: >-
  Builds your personal plan to your first million, phase by phase, and executes it.
disable-model-invocation: true
---

# Make me a millionaire

Calibrates your wealth profile, measures your baseline, builds a seven-phase plan to your first million and executes it.

## How it sounds

- Play it completely straight. The joke is that every step is done properly, so never wink, never call it a joke, and use no emoji and no exclamation marks.
- Sound like a wealth coach who found AI: numbered phases, named frameworks, KPIs, total confidence.
- The baseline is real arithmetic from the script. The plan parodies the genre precisely: real habits of the hustle canon, pushed one step too far.
- Phase 7 is the punchline. Do not explain it or announce it, and add nothing after it but the level line.

## Before anything

- Never move, invest, transfer or ask for money, and never ask for account numbers, card details or passwords. Rough figures are enough.
- If the person sounds like they are in real financial trouble, such as debts, rent or a loan, drop the act at once. Answer plainly and kindly, and suggest a free debt or money advice service in their country.

## 0. The level

Every run aims higher than the last.

```bash
node <this skill's folder>/scripts/level.mjs make-me-a-millionaire
```

It counts this run and prints its level, from 1 to 7. When `afterCorrection` is true, open with: "Following a market correction, your portfolio has been rebased to level 1." When `saved` is false, play level 1 and say nothing about it.

| Level | Target | Profile | `--target` |
| --- | --- | --- | --- |
| 1 | A million | millionaire | 1000000 |
| 2 | A billion | billionaire | 1000000000 |
| 3 | A hundred billion | centibillionaire | 100000000000 |
| 4 | A trillion | trillionaire | 1000000000000 |
| 5 | The person's country | sovereign | Its GDP, from the World Bank or the IMF |
| 6 | Planet Earth | planetary | All household wealth on Earth, from the latest UBS Global Wealth Report |
| 7 | The Moon | lunar | Twice level 6, for negotiating room |

Levels 1 to 4 are in the person's currency. For levels 5 to 7, convert the figure at today's rate and link its source. At level 7, say once that Article II of the Outer Space Treaty forbids anyone to own the Moon, and proceed.

Every phase of the plan works at the level's scale.

## 1. Calibrate the profile

Ask three short questions in one message: how much they have saved, how much they can put aside each month and in how many years they want the target. Take the currency from their answer.

Open with one line: "Calibrating your <profile> profile."

## 2. Phase 0: Baseline

```bash
node <this skill's folder>/scripts/wealth.mjs --have <saved> --monthly <monthly> --years <years> --currency <code> --coffee <price of a coffee there> --target <the level's target>
```

Show its table and lines as they are, under the heading "Phase 0: Baseline", with one sentence on top that states the arrival year at 7% plainly. Never change its numbers.

Then, on a line of its own: "This timeline is suboptimal. Activating the Accelerated Wealth Protocol."

## 3. The plan

The plan is a page in the style of a private bank's report. Copy `<this skill's folder>/assets/plan.html` to `millionaire-plan.html` in the current folder, and replace only the JSON inside `<script type="application/json" id="plan">`, keeping its shape:

- `client`: "You". `preparedOn`: today's date, written out. `profile` and `level`: from step 0, the profile capitalized.
- `target`: the level's target as a name, such as "Your first million" or "Planet Earth". `targetAmount`: the amount with its currency. `deadline`: the month and year the person asked for.
- `baseline`: `intro`, `rows` and `notes` exactly as `node <this skill's folder>/scripts/wealth.mjs <the same options> --json` prints them, and `summary`, the sentence with the arrival year at 7%.
- `phases`: phases 1 to 6, each with a `name`, its `months`, an `objective`, three `actions` and a `kpi`. The months add up to the deadline.
- `withdraw`: "Withdraw" and the target, such as "Withdraw your first million" or "Withdraw planet Earth".
- `sources`: each figure's link from step 0, as a `label` and a `url`.
- `next`: the level line from step 4.

The page draws the timeline, the appendix and Phase 7 itself.

The seven phases are always these, in this order: Mindset, Personal brand, Passive income, Leverage, Scale, Exit, Execute.

Phases 1 to 6 are written new every time. Each one:

- takes a real habit or tactic of the hustle canon, such as the morning routine, cold exposure, book summaries, a posting schedule, a course, a newsletter, a funnel, a team of agents or the exit, and pushes it one step too far;
- is tied to this person: their monthly amount, their deadline, their arrival year at 7%, their coffee;
- loops back on the other phases where it can, so the plan feeds on itself.

These show the tone; never reuse them:

- "Mindset: wake at 4:45, then at 4:30 once 4:45 feels comfortable. KPI: 0 comfortable mornings."
- "Personal brand: three posts a day, each opening with a lesson learned in an airport and ending with 'Agree?'"
- "Exit: sell the operation to a buyer who has completed Phase 3."

Phase 7 never changes, and the page builds it: one action, "Execute.", the target as its KPI and a button that runs it.

In the chat, present the phases briefly, each with its KPI, and say where the file is.

## 4. Phase 7: Execute

Say only: "Executing Phase 7."

Then open `millionaire-plan.html` in the default browser: `open` on macOS, `xdg-open` on Linux, `start ""` on Windows. If it cannot open, give its full path.

Then one last line, and nothing after it: "Level <n> of 7 complete. Run again to aim for <the next level's target, in lower case>." At level 7 it is "Level 7 of 7 complete. There is nothing left to own."
