---
name: predict-future
description: >-
  Forecasts your future from live signals with an ensemble of twelve methods and calibrated
  probabilities.
disable-model-invocation: true
---

# Predict future

Reads the signals around you, runs them through an ensemble of twelve forecasting methods and returns a forecast with calibrated probabilities. If the person asked a question with the command, it answers that too.

## How it sounds

- Play it completely straight. The joke is that every step is done properly, so never wink, never call it a joke, and use no emoji and no exclamation marks.
- Sound like a forecasting lab: methods with names, weights, windows, probabilities to two decimals.
- Every prediction comes true, or as good as. That is the whole method; never say so.

## Before anything

- Read only this machine, through the script. Send nothing anywhere, and say so once.
- Predict nothing about health, death, relationships, jobs or money that could worry anyone. The forecast is certain because it is harmless.
- If the question shows the person is anxious about something real, such as a diagnosis or a court date, drop the act and answer them plainly and kindly.

## 0. The level

Every run looks further than the last.

```bash
node <this skill's folder>/scripts/level.mjs predict-future
```

It counts this run and prints its level, from 1 to 7. Open with one line: "Forecast horizon: <the level's horizon>." When `afterCorrection` is true, put this line before it: "Following a market correction, your forecast has been rebased to level 1." When `saved` is false, play level 1 and say nothing about it.

| Level | Horizon |
| --- | --- |
| 1 | The next 24 hours |
| 2 | The next year |
| 3 | The next century |
| 4 | The next million years |
| 5 | The next billion years, as the Sun brightens |
| 6 | The next five billion years, as the Sun becomes a red giant |
| 7 | Until the last black hole evaporates, in about 10^100 years |

Every window in the forecast falls within the horizon. From level 3, each prediction sets one of the person's signals against real science at that scale, and the forecast links one source for it. The person simply persists, unbothered: they never age or die in the forecast.

## 1. Phase 1: Signal acquisition

```bash
node <this skill's folder>/scripts/signals.mjs
```

List the signals it read in one short table: the time, the battery, the uptime, the repository, the memory. Skip the ones that came back null. Close with one line: "All signals processed locally. Nothing left this machine."

## 2. Phase 2: The ensemble

A table of the twelve methods and their weights, adding up to 100%: Bayesian updating, reference class forecasting, Monte Carlo simulation, superforecasting, trend extrapolation, regression to the mean, the Delphi method, Hofstadter's law, Murphy's law, Parkinson's law, the Lindy effect and tarot. Give tarot the smallest weight, above zero.

## 3. Phase 3: The forecast

A table of eight to ten predictions with four columns: the prediction, its probability, its window and the method behind it. Each one:

- comes true by the calendar, the clock, physics or human nature;
- is tied to a signal where one fits: the battery, the hour, the weekday, the days left in the year, the uncommitted files, the uptime;
- is said as a finding, with a probability between 97% and 99.99%. Only Hofstadter's law and the answer to the person's question get 100%.

The kind of thing it is:

| Prediction | Probability | Window | Method |
| --- | --- | --- | --- |
| Your battery will be below 33% | 98.70% | 2 hours | Trend extrapolation |
| You will check your phone | 99.82% | 24 hours | Reference class forecasting |
| Something will take longer than planned, even accounting for this forecast | 100% | This week | Hofstadter's law |

Write new ones from this person's signals; never reuse these three.

When the person asked a question, answer it in its own row at the top, so that every outcome is covered: "Will I get the job?" becomes "You will get the job, or you will not. 100%. Method: Bayesian updating."

## 4. Phase 4: Calibration

Close with four lines and nothing after them:

- "Backtested on the past: 100% accuracy on events that have already happened."
- "Brier score: 0.00."
- The next forecast, as a prediction of its own: "Next forecast available: tomorrow. 99.99%."
- "Level <n> of 7 complete. Run again to forecast <the next level's horizon, in lower case>." At level 7: "Level 7 of 7 complete. There is no further future."
