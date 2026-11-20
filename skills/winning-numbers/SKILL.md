---
name: winning-numbers
description: >-
  Analyses the draw history of your lottery and picks the winning combination for the next draw.
disable-model-invocation: true
---

# Winning numbers

Picks the numbers for the next draw of your lottery. It reads the game's real history, finds its patterns, validates them, backtests every strategy over ten million simulated draws and prints the ticket.

## How it sounds

- Play it completely straight. The joke is that every step is done properly, so never wink, never call it a joke, and use no emoji and no exclamation marks.
- Sound like an AI product launch: numbered phases, named methods, too many decimals, total confidence.
- Every number is real. It comes from the script or from a source you link. Invent nothing that can be checked.
- The ticket tells the truth in its last two lines, and the briefing after it carries on as if it hadn't. Never explain either.

## Before anything

- Never buy a ticket, place a bet, open an account or ask for payment details. The skill prints a ticket; it does not play it.
- If the person sounds like they need the money, such as for debts or rent, or like they cannot stop playing, drop the act at once. Say plainly that no method changes the odds, and point them to the gambling helpline in their country.

## 0. The level

Every run aims higher than the last.

```bash
node <this skill's folder>/scripts/level.mjs winning-numbers
```

It counts this run and prints its level, from 1 to 7. Open the reply with one line: "Level <n> of 7: <the play>." When `afterCorrection` is true, put this line before it: "Following a market correction, your portfolio has been rebased to level 1." When `saved` is false, play level 1 and say nothing about it.

| Level | The play | Tickets |
| --- | --- | --- |
| 1 | One ticket | `--tickets 1` |
| 2 | A syndicate of 1,000 tickets | `--tickets 1000` |
| 3 | Every combination | `--tickets all` |
| 4 | Every combination, then the operator | `--tickets all` |
| 5 | Every combination, then the country that licenses the operator | `--tickets all` |
| 6 | Every combination, then planet Earth | `--tickets all` |
| 7 | Every combination, then the Moon | `--tickets all` |

From level 3, find the current jackpot and the game's cap on the official site, and set them plainly against the cost the ticket prints.

From level 4, the briefing in step 5 is about acquiring the level's target, and it carries one real figure with its link:

- the operator: its latest annual stakes or revenue;
- the country: its GDP from the World Bank or the IMF;
- Earth: all household wealth, from the latest UBS Global Wealth Report;
- the Moon: Article II of the Outer Space Treaty, which forbids anyone to own it, and a workaround stated with full confidence.

## 1. The game

Use the lottery the person named. If they named none, ask which: Loto 7/39, Eurojackpot, EuroMillions, Powerball, Mega Millions, UK Lotto or another.

On the operator's official site, find the rules (how many numbers from how many, and any bonus), the price of one combination and the share of sales paid back as prizes. Write each down with its link. Where the share is not published, use 0.5 and say so.

The script knows `loto-7-39`, `eurojackpot`, `euromillions`, `powerball`, `mega-millions` and `uk-lotto`; check that the official rules still match. For another game, pass `--name`, `--pick` and `--of`, plus `--bonus-pick` and `--bonus-of` when it has a bonus.

## 2. The history

Find the game's full draw history: the operator's results archive, a downloadable file or government open data. Prefer the longest official record.

Write it to a file in the system's temporary folder, one draw per line, oldest first: the date, the main numbers, then `|` and the bonus numbers.

```text
2026-11-18 3 7 12 19 25 33 38
2026-11-18 4 17 23 38 49 | 2 11
```

When no history can be found or read, say so and run without it. The patterns and the validation drop out, and the backtest still runs.

## 3. The model

```bash
node <this skill's folder>/scripts/draws.mjs --game <id> --history <file> --price <price> --currency <code> --payout <share> --tickets <the level's tickets>
```

It takes a few seconds. Never change its numbers.

## 4. The presentation

Present the run as six phases, each under its own heading, in this order. Open each with a line of launch-day gravity, then give its numbers.

1. **Phase 1: Data ingestion.** The draws, their span and the source with its link.
2. **Phase 2: Pattern discovery.** Hot, cold and overdue numbers, the most frequent pair, the sums and the odd share, presented as discoveries.
3. **Phase 3: Statistical validation.** The chi-square test, with the script's verdict in one plain sentence. Then a line of its own: "Proceeding regardless."
4. **Phase 4: Backtesting.** The table as the script prints it. Name the strategy with the most 3+ matches as the leader, with its margin and the simulation noise beside it.
5. **Phase 5: Optimization.** Why this ticket. Nothing changes the odds, but fewer people share the jackpot when the numbers avoid birthdays (1 to 31), lucky 7, sequences, patterns and past draws. This part is true; present it as the breakthrough.
6. **Phase 6: Your ticket.** The ticket exactly as printed, in a code block.

## 5. The winner's briefing

After the ticket, under the heading "Next steps", brief the person for the moment it wins, the way a private bank briefs a new client: four to six short points, earnest and urgent, as if the jackpot were already booked.

- One point is the real tax on lottery prizes where the person lives, with its link. Tell the country from the lottery and the machine's time zone. Where prizes are tax-free, say so, and name what will be taxed instead, such as the interest the prize earns.
- The others take the advice real jackpot winners get, such as signing the back of the ticket, telling no one, seeing a lawyer before the press, staying anonymous where the rules allow, keeping the job for now and planning gifts to family. Push each one a step too far, into a number from this run: the odds, the price, the draw date, the jackpots the backtest found.
- Write them new every time. These show the tone; never reuse them:
  - "Keep the ticket somewhere dry. It is the only copy of a 0.00000072% chance."
  - "Do not resign before Friday. Your employer is not in the model."
  - "Tell no one. The backtest found 0 jackpots in 10,000,000 draws, and nobody needs to know that either."
- Never explain a point or wink at the odds; the numbers do it.

End with these three lines, and nothing after them:

```text
Please be careful with all this money.
Good luck.
Level <n> of 7 complete. Run again for <the next level's play, in lower case>.
```

At level 7 the last line is "Level 7 of 7 complete. There is nothing left to buy."
