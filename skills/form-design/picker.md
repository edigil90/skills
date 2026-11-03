# The picker

The control that switches versions and states. It sits over the page where the form opens, so build the spec below and leave it alone.

## Outside the design system

Never style the picker with the project's tokens, fonts or colors. One that looks native to the product becomes part of what is being judged. It is one dark surface in the system font, and it ignores the theme, because dark reads as chrome over light and dark pages alike.

## Two groups, one list

The list has two groups under their headings, Version and State. `Today` comes first, then `Today, fixed`, then the three chosen ideas. With no form yet, the three ideas are the whole group.

- The Version buttons and select set the `__variant` search param, and the State buttons and select set `__state`. The page reads both back from the URL, so every version in every state is a link.
- Up and down step through the versions and left and right through the states. `H` toggles the `hidden` attribute on both the list and the bar, for recordings. With `__picker=off` in the URL, the page renders both with `hidden` from the start, for screenshots.
- Keys are ignored with a modifier held, when already `defaultPrevented` and from inputs, textareas, selects and contenteditable elements. They are also ignored from anything that uses arrows itself: `listbox`, `radiogroup`, `grid`, `menu`, `slider`, `spinbutton`, `tablist` and `combobox`.
- The active button in each group carries `aria-pressed="true"`. The list carries a label, and each group is a `role="group"` labelled by its heading.
- Switching keeps the dialog open and starts the form from that state's data. Where switching reloads the page, as in a server-rendered app, the page restores its scroll.

## Over a modal

A modal makes the page under it inert, and the picker with it.

- A native `<dialog>` opened with `showModal()` keeps only its own descendants live. Render the picker inside it. When the dialog is centered with a `transform`, the picker's fixed position is measured from the dialog and gets cut off. While the harness is on, center that dialog with `margin: auto` instead, which keeps it in the same place.
- A library dialog usually traps focus, sets `pointer-events: none` on the body and closes on an outside click. Give the picker `pointer-events: auto` and stop the dialog's outside-interaction handler for events inside the picker.
- Where the library marks the rest of the page `inert` or `aria-hidden`, render the picker inside the dialog's portal, so it counts as part of the dialog.

Then check that a click on the picker switches the version and the dialog stays open.

## Structure

```html
<nav class="fd-picker" aria-label="Form versions">
  <div class="fd-picker-group" role="group" aria-labelledby="fd-version">
    <span class="fd-picker-heading" id="fd-version">Version</span>
    <button type="button" data-variant="today" aria-pressed="true">Today</button>
    <button type="button" data-variant="today-fixed" aria-pressed="false">Today, fixed</button>
  </div>
  <div class="fd-picker-group" role="group" aria-labelledby="fd-state">
    <span class="fd-picker-heading" id="fd-state">State</span>
    <button type="button" data-state="empty" aria-pressed="true">Empty</button>
    <button type="button" data-state="errors" aria-pressed="false">Errors</button>
  </div>
</nav>

<div class="fd-picker-bar">
  <span class="fd-picker-select">
    <select aria-label="Version"><option value="today" selected>Today</option></select>
    <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4" /></svg>
  </span>
  <span class="fd-picker-select">
    <select aria-label="State"><option value="empty" selected>Empty</option></select>
    <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4" /></svg>
  </span>
</div>
```

In a framework, keep the class names and the structure and change only the rendering syntax.

## Placement and styling

On a wide screen the list is fixed to the left edge, over everything, and scrolls inside itself. Below 900px the list gives way to a bar of two selects fixed to the bottom, so the form keeps the width it has on a phone. Both are always rendered and the media query shows one, so the active entries survive a resize.

```css
.fd-picker,
.fd-picker-bar {
  all: unset;
  position: fixed;
  z-index: 2147483647;
  box-sizing: border-box;
  pointer-events: auto;
  background: rgb(20 20 20 / 0.94);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.1);
  font: 13px/1 system-ui, -apple-system, "Segoe UI", sans-serif;
  color: rgb(255 255 255);
  color-scheme: dark;
  user-select: none;
}

.fd-picker[hidden],
.fd-picker-bar[hidden] {
  display: none !important;
}

.fd-picker {
  display: flex;
  flex-direction: column;
  gap: 14px;
  top: 16px;
  left: 16px;
  width: 200px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  scrollbar-width: none;
  padding: 6px;
  border-radius: 14px;
}

.fd-picker-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fd-picker-heading {
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 500;
  color: rgb(255 255 255 / 0.45);
}

.fd-picker button {
  all: unset;
  padding: 8px 10px;
  border-radius: 8px;
  color: rgb(255 255 255 / 0.6);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 150ms ease-out;
}

.fd-picker button:hover {
  color: rgb(255 255 255 / 0.85);
}

.fd-picker button[aria-pressed="true"] {
  background: rgb(255 255 255 / 0.14);
  color: rgb(255 255 255);
  font-weight: 500;
}

.fd-picker button:focus-visible,
.fd-picker-bar select:focus-visible {
  outline: 2px solid rgb(255 255 255 / 0.7);
  outline-offset: 2px;
}

.fd-picker-bar {
  display: none;
  gap: 8px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  padding: 6px;
  border-radius: 999px;
}

.fd-picker-select {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
}

.fd-picker-bar select {
  all: unset;
  flex: 1;
  min-width: 0;
  min-height: 44px;
  box-sizing: border-box;
  padding: 0 34px 0 14px;
  line-height: 44px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.1);
  font-weight: 500;
  cursor: pointer;
}

.fd-picker-select svg {
  position: absolute;
  top: 50%;
  right: 14px;
  translate: 0 -50%;
  pointer-events: none;
  color: rgb(255 255 255 / 0.6);
}

@media (max-width: 899px) {
  .fd-picker { display: none; }
  .fd-picker-bar { display: flex; }
}
```

`all: unset` keeps the project's global button, nav and select styles out of the picker. It also removes a select's own arrow, which is why the chevron is drawn beside it.
