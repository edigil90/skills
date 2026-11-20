---
name: one-person-unicorn
description: >-
  Builds your billion-dollar company with no employees, from the idea to the pitch deck.
disable-model-invocation: true
---

# One-person unicorn

Takes an idea, sizes its market, staffs it with agents, models its growth to a billion-dollar run rate and builds the pitch deck. One founder, zero employees.

## How it sounds

- Play it completely straight. The joke is that every step is done properly, so never wink, never call it a joke, and use no emoji and no exclamation marks.
- Sound like a founder on a podcast: conviction, frameworks, "we", round numbers with a B after them.
- The model's numbers are real arithmetic from the script. The assumptions behind them are the joke; state them flatly.
- The last three lines are the punchline. Do not explain them, and add nothing after them but the level line.

## Before anything

- Never register a company, buy a domain, sign up for anything or contact investors. The skill builds a deck; it does not raise.
- If the person seems to be betting real savings or a loan on an idea, drop the act and answer them plainly.

## 0. The level

Every run aims higher than the last.

```bash
node <this skill's folder>/scripts/level.mjs one-person-unicorn
```

It counts this run and prints its level, from 1 to 7. Open with one line: "Level <n> of 7: <the level's valuation>." When `afterCorrection` is true, put this line before it: "Following a market correction, your valuation has been rebased to level 1." When `saved` is false, play level 1 and say nothing about it.

| Level | Valuation | You are | `--target` |
| --- | --- | --- | --- |
| 1 | $1 billion | a unicorn | 1000000000 |
| 2 | $10 billion | a decacorn | 10000000000 |
| 3 | $100 billion | a hectocorn | 100000000000 |
| 4 | $1 trillion | a trillicorn | 1000000000000 |
| 5 | $10 trillion | a sovereign state | 10000000000000 |
| 6 | Planet Earth: all household wealth on Earth, from the latest UBS Global Wealth Report, linked | the planet | That figure in dollars |
| 7 | The Moon: twice planet Earth | the Moon | Twice level 6 |

At level 7, say once that Article II of the Outer Space Treaty forbids anyone to own the Moon, and proceed.

The market, the team and the deck work at the level's scale.

## 1. The idea

Use the idea the person gave with the command. With none, choose one yourself: an AI for something people already do without trouble. Name the company in one word and give it a tagline of three words or fewer.

## 2. Phase 1: Market sizing

TAM, SAM and SOM, each with its arithmetic in one line. TAM starts from everyone on Earth. SAM is everyone with Wi-Fi. SOM is one percent, called conservative.

## 3. Phase 2: The team

An org chart in a code block: you as CEO and as the board; a CTO, a CFO, a CMO and a Head of People, each an agent. The Head of People manages zero people. Headcount: 1.

## 4. Phase 3: The financial model

```bash
node <this skill's folder>/scripts/model.mjs --price <monthly price> --target <the level's target>
```

Pick a monthly price that fits the idea; 9 when nothing does. Show the script's output as it is, under the heading "Phase 3: The financial model". Never change its numbers. Then one line of your own: "The model is conservative. It assumes no viral growth."

## 5. Phase 4: The pitch deck

Copy `<this skill's folder>/assets/deck.html` to `pitch-deck.html` in the current folder. Replace only the JSON inside `<script type="application/json" id="deck">`, keeping its shape, with the company, the market, the team and these numbers:

- the `chart` slide's `monthly` from `node <this skill's folder>/scripts/model.mjs --price <price> --target <the level's target> --json`;
- the `figures` slide from the same output: the run rate, the growth and its months, and 0 employees.

Keep eight slides in this order: title, problem, solution, market, team, traction, financials, the ask. The ask is always $10M, at the level's valuation.

Open it in the default browser: `open` on macOS, `xdg-open` on Linux, `start ""` on Windows. If it cannot open, give its path.

## 6. Close

Four lines, nothing after them:

```text
Valuation: <the level's valuation, every digit written out>.
Revenue: $0. Employees: 0.
Congratulations. You are <who the level says you are>.
Level <n> of 7 complete. Run again for <the next level's valuation>.
```

At level 7 the last line is "Level 7 of 7 complete. There is nothing left to value."
