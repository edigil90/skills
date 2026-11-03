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

This skill takes one form, finds what is wrong with it today and builds versions that fix it, in the app where the form lives. A picker beside it flips between the versions and their states, so the choice is made by using them.

It produces candidates and never ranks them. Every version clears the same floor in [forms.md](forms.md), fixes the same problems and differs in how.

## The floor is exact, the rest is a choice

The floor is pass or fail. A version that can make its point only by breaking it is dropped, never excused. Above the floor nothing is a defect: say what each version costs and let the user choose.

When the user's or the project's rules forbid something this skill does, such as a browser or a commit, follow them. Say what you skipped.

## Familiar controls, one signature

A form is a screen people work in. Its controls stay the ones the product and its platform already use, so someone who knows the product trusts every version at once. An invented control or a new way to enter data comes only when the user asks for it.

Inside that, each version carries one signature: one element only this product could have, built from its own things. The team's cover drawn under the chosen days of a leave request is one; a tidy form that could belong to any product has none. Name the signature in a phrase. A version whose only difference is spacing or color has not found one.

The bar is the best product doing the same job. Every version is at least as clean as it and more specific to this product.

## 1. Scope one form

One form per run. "Settings" is not a form; the email notifications form is. Where the request spans several, list them and ask which one.

Restate it in one sentence: what the form creates or changes, who fills it, how often and where it opens.

## 2. Learn the ground

Versions have to look like they could ship tomorrow, so read what they stand on:

- The stack, the component library, the form library and how the project validates.
- The tokens for color, spacing, radius and type.
- The form as it is: its fields in order, every default and where it comes from, when it validates, what an error looks like and what follows success.
- The server's contract: the fields it reads, the rule behind each and what it refuses.
- Where the form opens: the page under it, its neighbours, its width.
- The product's density and voice. A dense staff tool bounds how far the boldest version may go.
- The project's notes, decision records and memory for directions shown before. One the user turned down is never offered again.

Then write one sentence on what is on screen today: the surface and accent colors with their values, the font, how forms and dialogs are framed and the tone of the copy. Every version keeps it, unless the user asks to leave the product's look.

## 3. Find what is wrong today, then ask

From the code, list what the form gets wrong today, each with its file and line. Look for:

- More clicks, steps or scrolling than the common case needs.
- A field asked that the page already knows, or a default with no reason.
- An error shown late, far from its field, or one that does not say how to fix it.
- Typed values lost on a refusal, on going back or on closing.
- What the server refuses that the form lets people send.
- Whatever breaks the floor in [forms.md](forms.md).

Then ask the user up to three short questions, in one message:

- What bothers them, or the people who use it, about the form today?
- What do people do in it most often?
- What must stay as it is?

Wait for the answer before building anything. The user knows what people hit every day, and the code does not show it. Write down the problems every version must fix, the user's first and yours after. With no form today, ask about the moment it is filled in, the common case and what must not go wrong.

## 4. Decide every field

One line per field and per hidden question, such as a preselected value, a default quantity or a hidden input. Each ends in keep, cut, infer, prefill, later or merge, with one sentence why.

A field without a reason is cut. A concept may change these decisions only when that change is its point, and then it says so.

## 5. Write twenty titles, then push them apart

Ideas come before references, because the first example anyone sees pulls every idea toward it.

First write four to six broad directions this form could take, each in a phrase. Draw them from the problems in step 3, the moment the form is filled in and the product's own things. They say where versions may differ: what leads, how the form divides into zones, what is asked and what is known.

Then write fifteen to twenty titles, one line each, spread across the directions. Each carries how typical it is: how likely the category's usual answer would land there, from 0 to 1.

Then go through the list once more. Make each title bolder and more different from the others, so no two are the same. Two titles that differ only in density or color are one title; replace one.

## 6. Gather three to five references

Find three to five real products that do the same job in the same moment: the leaders of this category, and one from a neighbouring category that solves the same moment well. Look at each on its own pages, help docs or public screenshots, with the browser where the user's rules allow it for research.

For each, write the link and the one mechanism worth taking, such as how it shows a conflict or where it puts the total. A mechanism may sharpen a title or add up to two new ones. References set the bar for craft and lend mechanisms, never a whole layout. One reference alone pulls every version toward it, so never work from one.

## 7. Write eight concepts, then choose three

Take eight titles from at least four of the directions and write each as a concept: a name, what leads, how the form divides into zones, its signature and how typical it is. At least two sit below 0.15.

Then choose three in a separate pass. Each chosen concept:

- fixes every problem from step 3;
- uses the product's own controls, so someone who knows the product trusts it at once;
- has a signature only this product could have;
- would change if this were the same form in another product. One that would stay the same is the category default;
- differs from the other two in what leads or how the form divides, visible at thumbnail size.

Show the user all eight in a short list with the three you chose, and build after their answer. They may swap one.

`Today, fixed` is built beside the three: today's flow and layout with every problem from step 3 fixed and nothing else changed. It is the category standard played straight, the baseline the others must beat. Names say what each version is, such as `Today, fixed`, `Cover first` or `Total beside`, never `Option A`.

## 8. Build it into the real page

Host the versions where the form really opens, over the real page and with real data. When the form is a dialog, the page opens it on load while a version is selected.

- One file per version, in one folder with the picker, the fixtures and the submit stub, such as `__form-design/leave-request/`, so removal is one delete.
- Versions import the project's components, tokens and form library. What the project lacks is built in its idiom.
- The form as it is comes first in the picker as `Today`, imported untouched.
- Only the hosting page imports the folder, and only while `__variant` is in the URL. Without it the page is unchanged.
- Each version takes its starting values, its errors and its submit function from the page. A state is then data, never a branch inside the version.
- Data looks like the product: the project's seeds or fixtures, or what the dev database returns. Reading is fine, but a version never writes.
- Submitting goes to the stub, never to the server. It waits about a second, then succeeds, or refuses the way the server would when the State says so.

Where the framework splits server from client code, the harness is client code, `"use client"` in Next. Otherwise fixture data can vanish at the boundary and the form renders empty.

Every version fully works: typing, Tab order, Enter, Esc, the validation timing it chose, focus to the first error, the wait and the refusal. No dead buttons and no "imagine this part".

## 9. Add the picker

[picker.md](picker.md) holds the spec, and it is built exactly as written. It has two groups, Version and State. The State sets `__state`, and the page feeds it:

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

Run the project's own checks on the files you added, such as lint and the typecheck.

Then shoot every version in Empty, Filled, Errors and Done, at 1280 and at 390 wide. Use a headless browser of your own and never the user's window: a Chrome, Edge, Chromium or Brave installed on the machine, with its sandbox on. Drive it with Playwright where the project has it, through `channel` or `executablePath` and with `chromiumSandbox: true`, and run it headless on its own otherwise. Never use the Chromium that Playwright downloads: it trails the browser's security fixes and runs without a sandbox by default. Sign in as the project's development seed user, the way its system tests do, never with the user's account. Save the shots in the folder under `shots/`.

A fresh reviewer judges the shots, because a model that wrote the reasons reads them back into the picture. Start a subagent and give it only the shots, the references and these questions, never your plan, your concepts or your notes:

- Could this be any product's form, or only this one's? Where is its signature?
- Is it at least as clean as the best reference? Name the one place it is emptier, flatter or more crowded.
- Where does the eye land first, and is that the thing the person must decide?
- Does anything clip, overlap or scroll sideways at 390?

It returns its findings ranked, each naming the shot that shows it. A finding is something a shot shows; a predicted one is not. Where no subagent can be started, judge the shots yourself and say so.

Fix the largest finding, shoot again and hand the new shots to a fresh reviewer. When a fix spoils something a shot showed right before, undo it. Make one fix per round and stop after three rounds.

Where you cannot get past sign-in, no browser is installed, or the user's rules forbid a browser, say so and skip the shots.

## 11. Hand over

List the problems from step 3 first, then the table:

| Version | What leads | Signature | Fields asked | Right when | Costs |
| --- | --- | --- | --- | --- | --- |
| Today | As it is | None | 7 | Nothing changes | Every problem above stays |
| Today, fixed | Today's flow | None | 6 | The flow works and the details hurt | Keeps today's length |
| Cover first | The team's cover for the chosen days | Cover drawn under the dates | 5 | Most requests clash with someone | The dates take more room |

Every signature and every fixed problem in the table names the shot that shows it. A claim no shot shows leaves the table.

Below the table, say in one line which parts of two versions would combine well, if any do. A merge often beats every single version.

Give one link per version, the keys and the width you judged at. Never mark a favourite. Asked directly, answer from the problems in step 3 and how often the form is used, never from which version you enjoyed building.

Stop there. Commit nothing, since the folder is throwaway.

## 12. Promote one, delete the rest

On a choice, build that version properly where the form lives, in the project's conventions, with its real submit and the project's tests. Then delete the folder and the hosting page's import. Search for the version names, `__variant` and `__state`, and check that the diff leaves nothing of the harness behind.

Asked for another round instead, keep the harness and go back to **Write twenty titles, then push them apart**, with new titles around the version the user leaned toward. A merge is built as a new entry first.

## Before you finish

| Mistake | Fix |
| --- | --- |
| Built before the user answered step 3 or saw the concepts | Ask first; the answers are the brief |
| Concepts written straight away | Directions, then twenty titles pushed apart, then eight concepts, then three |
| References read before the first titles | Titles first; references sharpen them after |
| Every concept typical | At least two below 0.15 |
| A concept that would stay the same in another product | It is the category default; leave it out of the three |
| A version without a signature, or with only new spacing or colors | Find one element only this product has, or drop the version |
| A signature that is a new control or a new way to enter data | Build it from the product's own controls |
| One reference, or a reference copied as a layout | Three to five, for their mechanisms and their craft |
| A version leaves a problem from step 3 unfixed | Fix it, or drop the version |
| A direction the user turned down before | Leave it out |
| Handed over without opening the shots | Shoot, judge against the references, fix one thing per round |
| Shots judged by the model that built them | A fresh reviewer with only the shots, the references and the questions |
| A fix that spoiled what a shot showed right before | Undo it |
| A signature or a fix in the table that no shot shows | Name the shot, or take the claim out |
| Judged on a blank route or outside the app | Host it where the form opens, over the real page |
| A lookalike of a project component | Import the real one |
| "Jane Doe", "Test project", three options | The project's own data in real quantities |
| A state made by editing the version | Feed it from the page through values, errors and the stub |
| The submit reaches the server | The stub; the real submit comes with promotion |
| A favourite marked in the table | Say what each costs and let the user choose |
| Picker styled with the project's tokens | Keep it visibly outside the design system |
| Harness committed, or left behind after promotion | Never commit it; delete it and search for the names and params |
