---
name: form-design
description: >-
  Designs and redesigns forms. Builds the strongest ideas as working versions in your app, with your
  own components, so you can try each one and choose.
disable-model-invocation: true
license: MIT
metadata:
  author: "Edi Gil"
  url: "https://www.edigil.com"
  version: "0.9.9"
---

# Form design

This skill designs a new form or redesigns an existing one by building versions of it in the app where it lives. A picker over the page switches between the versions and their states, so the choice is made by using them.

It never marks a favourite. Every version clears the floor in [forms.md](forms.md) and fixes the same problems, and the versions differ in how.

## Pass or fail, then a choice

The floor is pass or fail, and a version that needs to break it is dropped. Above the floor nothing is a defect: say what each version costs and let the user choose.

Where the user's or the project's rules forbid something this skill does, such as a browser or a commit, follow them and say what you skipped.

## Known controls, one element of its own

People work in forms, so every version uses the controls the product already has. A new control or a new way to enter data comes only when the user asks for it.

Within that, each idea has one element only this product could show, made from its own data. The team's cover drawn under the chosen days of a leave request is one. Name it in a phrase. When the form holds nothing of the kind, such as a password change, say so, and let the ideas differ in what leads and how the form is divided.

The bar is the best product doing the same job. Each version is as tidy as it and more specific to this product.

## 1. Scope one form

One form per run. "Settings" is not a form; the email notifications form is. Where the request spans several, list them and ask which one.

Restate it in one sentence: what the form creates or changes, who fills it, how often and where it opens.

## 2. Learn the ground

Read what the versions will stand on:

- The stack, the component library, the form library and how the project validates.
- The tokens for color, spacing, radius and type.
- The form as it is: its fields in order, every default and its source, when it validates, what an error looks like and what follows success.
- The server's contract: the fields it reads, the rule behind each and what it refuses.
- Where the form opens: the page under it, its neighbours and its width.
- The product's density and voice. A tool staff use every day may be dense and keyboard-first; a page a guest fills once is calm and touch-first.
- The project's decision records and the agent's memory, for versions the user turned down before. None of them is offered again.

Then write one sentence on what is on screen today: the surface and accent colors with their values, the font, how dialogs are framed and the tone of the copy. Every version keeps it unless the user asks otherwise.

## 3. Find what is wrong, then ask

From the code, list what the form gets wrong, each with its file and line. Look for:

- more clicks or steps than the common case needs;
- a field the page already knows, or a default with no reason;
- an error shown late or far from its field;
- typed values lost on a refusal, on going back or on closing;
- what the server refuses that the form lets through;
- whatever breaks the floor.

Then ask the user up to three short questions in one message: what bothers people about the form, what they do in it most often and what must stay. With no form yet, ask about the moment it is filled in, the common case and what must not go wrong.

Wait for the answer. Write down the problems every version must fix, the user's first.

## 4. Decide every field

One line per field and per hidden question, such as a preselected value or a hidden input: keep, cut, infer, prefill, later or merge, with the reason. A field without a reason is cut. An idea may change a decision only when that change is its point, and it says so.

## 5. Write the ideas, then push them apart

Ideas come before references, since the first example seen pulls every idea toward it.

Write four to six directions this form could take, each in a phrase, drawn from the problems, the moment it is filled in and the product's own data. Then write fifteen to twenty ideas, one line each, spread across the directions. Give each a number from 0 to 1 for how likely the usual answer in this category would land there.

Then go through the list again and make each idea bolder and more unlike the others. Two ideas that differ only in density or color are one.

## 6. Check three to five references

Find three to five real products doing the same job in the same moment, one of them from a neighbouring category. Look at their own pages, help docs or public screenshots.

For each, write the link and the one mechanism worth taking, such as how it shows a conflict or where it puts the total. A mechanism may sharpen an idea or add up to two. Never take a whole layout.

## 7. Choose three and show them

Choose three ideas from different directions, at least one of them below 0.15. Each one:

- fixes every problem from step 3;
- uses the product's controls;
- has its own element, unless the form holds none;
- would look different if this were the same form in another product;
- differs from the other two in what leads or how the form is divided, at a glance.

Write each of the three in three lines: what leads, how the form is divided and its own element. Then show the user the whole list, grouped by direction, with the three marked. Build after their answer; they may swap one.

Beside the three, build `Today, fixed`: today's flow and layout with every problem fixed and nothing else changed. It has no element of its own and is the baseline for the others. With no form yet, there is no `Today` and no `Today, fixed`.

Names say what each version is, such as `Cover first` or `Total beside`, never `Option A`.

## 8. Build it into the real page

Host the versions where the form opens, over the real page and with real data. When the form is a dialog, the page opens it on load while `__variant` is in the URL.

- Everything the harness adds lives in one folder, such as `__form-design/leave-request/`. Where the stack spreads files by kind, as Rails does with views and controllers, put `__form-design` in every path, so removal is one search.
- Versions use the project's components, tokens and form library. Anything missing is built the project's own way.
- `Today` is the form as it is, untouched, first in the picker. It shows the states it reaches on its own, usually Empty. A capture-phase listener on its wrapper stops its submit before the server; where it submits some other way, say so and ask before adding a hook.
- Only the hosting page loads the harness, and only while `__variant` is in the URL. In a bundled app that takes a dynamic `import()`.
- Each version you build gets its values, its errors and its submit from the page, so a state is data and never a branch in the version.
- In a server-rendered app, the page renders the version's template with the State's data, and the harness turns a submit into a visit to the next State's URL.
- Data comes from the project's seeds, fixtures or dev database. A version reads and never writes.
- Submitting goes to the stub, never to the server. Under Sending it stays pending, under Refused it answers as the server would, and otherwise it succeeds after about a second.

Where the framework splits server from client code, as Next does, the page loads the data and the harness that receives it runs on the client.

Every version works: typing, Tab order, Enter, Esc, its validation timing, focus to the first error, the wait and the refusal.

## 9. Add the picker

[picker.md](picker.md) holds the spec; build it as written. It has two groups, Version and State, set through `__variant` and `__state`:

| State | What the page feeds |
| --- | --- |
| Empty | The form as it opens, with the defaults step 4 kept |
| Filled | Realistic values, including the longest the data holds |
| Errors | A submit with two fields wrong, shown the way the version shows errors |
| Sending | A submit held pending until the State changes |
| Refused | A submit the stub refuses as the server would |
| Done | A submit accepted, with what comes next |

Keep only the states a version can reach, and say which you dropped.

## 10. Look at what you built

Run the project's lint and typecheck on the files you added.

Then shoot every version in Filled at 1280 and 390 wide, and in Errors at 390, with `__picker=off` so the picker stays out of the frame. Use a headless browser of your own, never the user's window: a Chrome, Edge, Chromium or Brave installed on the machine, with its sandbox on. With Playwright, pick it through `channel` or `executablePath` and set `chromiumSandbox: true`, since Playwright turns the sandbox off otherwise. Never use the Chromium that Playwright downloads, which trails the browser's security fixes. Sign in as the project's development seed user, the way its system tests do, never as the user. Save the shots under `shots/` in the folder.

Give the shots, the references' links and these questions to a fresh subagent that has not seen your reasons:

- Could this be any product's form? Where is its own element?
- Is it as tidy as the best reference? Name the one place it falls behind.
- What does a person see first, and is that the decision they must make?
- Does anything clip, overlap or scroll sideways at 390?

It returns its findings ranked, each naming its shot. Where no subagent can start, judge the shots yourself and say so.

Fix the largest finding, shoot that version again and give the reviewer the shot before and after. Undo the fix when the shot before was better. Stop after three fixes.

Where sign-in, a missing browser or the user's rules stop the shots, say so and skip them.

## 11. Hand over

List the problems first, then the table:

| Version | What leads | Its own element | Fields asked | Right when | Costs |
| --- | --- | --- | --- | --- | --- |
| Today | As it is | None | 7 | Nothing changes | Every problem above stays |
| Today, fixed | Today's flow | None | 6 | The flow works and the details hurt | Keeps today's length |
| Cover first | The team's cover for the chosen days | Cover drawn under the dates | 5 | Most requests clash with someone | The dates take more room |

Each element and each fix in the table names the shot that shows it. A fix no shot can show, such as a key or a value kept after a refusal, says how you checked it. Without shots, say which claims are unchecked.

Below the table, say in one line which parts of two versions would combine well, if any do.

Give one link per version, the keys and the width you judged at. Asked which one you would pick, answer from the problems and how often the form is used.

Stop there and commit nothing; the folder is throwaway. When the user turns a version down, write it down with one line why, in the project's decision records or the agent's memory for this project.

## 12. Promote one, delete the rest

The user answers with a version to promote, two to merge, or another round around one.

To promote, build that version properly where the form lives, with its real submit and the project's tests. Then delete the harness and the hosting page's hook. Search for the version names, `__form-design`, `__variant` and `__state`, and check that the diff holds nothing of the harness.

A merge is built as a new entry in the harness first. Another round keeps the harness and goes back to step 5, with new ideas around the version the user leaned toward.

## Before you finish

| You see | Fix |
| --- | --- |
| A lookalike of a project component in a version | Import the real one |
| "Jane Doe", "Test project" or three options | The project's own data in real quantities |
| A version with a branch for each State | Feed the State from the page |
| A request from a version to the real server | Point it at the stub |
| The picker in the product's colors or font | Keep it outside the design system |
| `__form-design`, `__variant` or `__state` left after promotion | Delete it |
