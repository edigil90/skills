# The floor

The rules every version clears, whatever its idea. They are pass or fail, and none of them is a direction.

The rules on what the form asks, labels, types, errors, sending, failure, keyboard and pickers hold even where the product's own components fall short. The rules on shape, size and decoration give way to the product's look. Where its components do otherwise, such as uppercase labels or a centered dialog, keep the product's way and name it in the hand-over as a suggestion.

## What the form asks

- Every field has its line from step 4. A value that can be inferred, inherited or asked later is not asked now.
- A field that cannot have a value in this case is not drawn.
- Fields that describe one thing are one field: one name, one date and time, one amount with its currency.
- Every default has a reason. A choice with a consequence, such as a price, a payment or a notification to someone, is never prefilled.
- A choice from a known set shows its value, never its emptiness: "Project: Website relaunch", not "Select a project".
- Mark whichever is rarer, required or optional. When an empty field means something, say what in the field and mark nothing.

## Labels

- A visible label tied to its field, with `<label for>` or a wrapping label.
- A placeholder is an example in the accepted format, never the label and never an instruction.
- No floating labels. A bare field is allowed only where its row already names it, such as a title field in a dialog or a value in a properties row.
- A hint only where step 4 kept one, tied with `aria-describedby`.

## Types and autofill

- Fields about the person filling the form carry `type`, a stable `name` and `autocomplete`: `name`, `email`, `tel`, `street-address`, `postal-code`, `country`, `cc-number`, `new-password`, `one-time-code`.
- When staff type a customer's details, set `autocomplete="off"` on those fields. Otherwise autofill offers the staff member's own.
- Codes, card numbers and PINs are `type="text" inputmode="numeric"`, never `type="number"`. Money is `inputmode="decimal"`.
- `spellcheck="false"` on emails, codes and usernames. Paste always works, and no mask blocks typing.

## Errors

- No error before the person is done. The first check runs on submit; a format problem may show when a filled field is left.
- An error clears the moment it is fixed.
- On submit, every error shows at once and focus moves to the first one.
- An error sits by its field and says how to fix it: "Enter a phone number with its country code", never "Invalid input".
- The field carries `aria-invalid="true"` and points at its error with `aria-describedby`. Color is never the only sign.
- One error, one place. A form-level error appears only while no field shows one, and never only as a toast.
- The same rule and the same wording run on the client and the server.

## Sending

- The submit button stays enabled until the form is sent. Pressed early, it shows what is missing and focuses it.
- It says what happens: "Create project", never "Submit". The last step of a flow names the consequence, such as "Pay €48".
- While sending, the pressed button keeps its place and shows a pending label ending in one "…" character, "Creating…". It carries `aria-disabled="true"` and ignores a second press.
- The rest of the form is locked, and a dialog cannot close by Esc, outside click or its close button.
- When the form unlocks, focus returns to the button or to what replaced it.
- A destructive action is never the form's submit. It is a separate button with a confirmation or an undo.

## Failure and success

- Typed values survive every failure: a refusal, a thrown error, a lost connection, going back.
- A refusal says what happened and what to do, by the field it concerns where there is one.
- "Try again" is always a button. Retrying is safe because the server ignores a repeat.
- Success names the action and the object, "Project created", never "Success!". It leads to the object or the next step, the way the product does elsewhere.

## Keyboard

- Tab order follows the visual order.
- Enter submits from a single-line field. A field with its own action, such as a code with Apply, takes Enter for itself.
- Cmd or Ctrl and Enter submits from anywhere, including a multi-line field.
- Esc closes a dialog that has no changes. With changes, it asks, or keeps a draft where the product keeps drafts.
- Enter that confirms an input method's composition (`event.isComposing`) never submits.

## Pickers

- A list people search takes typing at once, with the highlight moved by arrows and the choice made by Enter.
- The chosen value stays in view after it is picked.
- A popover is never clipped by a scrolling parent. It renders in the top layer or a portal.

## Shape and size

- Fields sit in one column. Pairs that are one datum may share a row, such as a start and end time. A summary or a total may sit beside the fields.
- The form's own frame is as big as what it holds. A dialog's width fits its content and its height grows with it, anchored at the top.
- At 390px wide nothing scrolls sideways, long words wrap and grid children carry `min-width: 0`.
- On touch, field text is 16px or larger so the page does not zoom, and targets are 44px.
- A tool staff use every day may be dense and keyboard-first. A page a guest fills once is calm and touch-first.

## Nothing that repeats

- No description that repeats the title, no hint that repeats the label and no placeholder that repeats either.
- No card inside a card, no icon in every field, no uppercase labels, no emoji, no gradient or glow.
- No Reset button and no two filled buttons side by side.
- No confirm-password or confirm-email field. Show the password on request, and show the address back after the form is sent.
