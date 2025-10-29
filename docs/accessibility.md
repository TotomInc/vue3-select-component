# Accessibility

This component follows the [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) to ensure a fully accessible experience for all users, including those using assistive technologies like screen readers.

## Overview

The component implements comprehensive accessibility features including:

- **ARIA attributes** for proper semantic markup
- **Keyboard navigation** for complete keyboard-only operation
- **Focus management** for intuitive interaction flow
- **Screen reader support** with descriptive labels and states

## ARIA Attributes

### Combobox Role

The main container uses the `combobox` role to identify itself as an interactive input control:

```html
<div
  role="combobox"
  aria-expanded="true"
  aria-controls="vue-select-{uid}-listbox"
  aria-owns="vue-select-{uid}-listbox"
  aria-haspopup="true"
>
```

**Attributes:**
- `aria-expanded`: Indicates whether the dropdown menu is open (`true`) or closed (`false`)
- `aria-controls`: References the ID of the listbox element that this combobox controls
- `aria-owns`: Indicates ownership of the listbox element
- `aria-haspopup`: Signals that the combobox can trigger a popup menu

### Listbox Role

The dropdown menu uses the `listbox` role to identify itself as a list of selectable options:

```html
<div
  role="listbox"
  aria-multiselectable="true"
  aria-label="Select options"
>
```

**Attributes:**
- `aria-multiselectable`: Set to `true` when `isMulti` prop is enabled, indicating multiple selections are allowed
- `aria-label`: Provides an accessible name for the listbox (derived from the `aria.labelledby` prop)

### Option Role

Each menu option uses the `option` role with appropriate state attributes:

```html
<div
  role="option"
  aria-selected="true"
  aria-disabled="false"
>
```

**Attributes:**
- `aria-selected`: Indicates whether the option is currently selected
- `aria-disabled`: Indicates whether the option is disabled and cannot be selected

### Search Input

The search input includes autocomplete attributes for better screen reader support:

```html
<input
  aria-autocomplete="list"
  aria-labelledby="vue-select-{uid}-combobox"
  autocomplete="off"
  autocorrect="off"
  autocapitalize="none"
  spellcheck="false"
>
```

**Attributes:**
- `aria-autocomplete="list"`: Indicates that autocomplete suggestions appear in a listbox
- `aria-labelledby`: Associates the input with the combobox container for proper labeling
- Standard HTML attributes to disable browser autocomplete features that might interfere with the component

### Clear Button

The clear button in multi-value tags includes an accessible label:

```html
<button
  type="button"
  aria-label="Remove {option-label}"
>
```

## Configurable ARIA Props

You can customize ARIA attributes through the `aria` prop:

```vue
<VueSelect
  :aria="{
    labelledby: 'my-custom-label',
    required: true
  }"
/>
```

**Available options:**
- `labelledby`: ID of an element that labels the select component
- `required`: Indicates whether selecting an option is required

**Example:**

```vue
<template>
  <div>
    <label id="country-label">Select your country</label>
    <VueSelect
      v-model="selectedCountry"
      :options="countries"
      :aria="{ labelledby: 'country-label', required: true }"
    />
  </div>
</template>
```

## Keyboard Navigation

The component provides full keyboard support following WAI-ARIA best practices.

### When Menu is Closed

| Key | Action |
|-----|--------|
| <kbd>Space</kbd> | Opens the dropdown menu |
| <kbd>Enter</kbd> | Opens the dropdown menu |
| <kbd>↓</kbd> (Arrow Down) | Opens the dropdown menu and focuses first option |
| <kbd>↑</kbd> (Arrow Up) | Opens the dropdown menu and focuses first option |
| <kbd>Tab</kbd> | Moves focus to next focusable element |

### When Menu is Open

| Key | Action |
|-----|--------|
| <kbd>↓</kbd> (Arrow Down) | Moves focus to next non-disabled option (wraps to first option when reaching the end) |
| <kbd>↑</kbd> (Arrow Up) | Moves focus to previous non-disabled option (wraps to last option when reaching the start) |
| <kbd>Enter</kbd> | Selects the focused option and closes menu (if `closeOnSelect` is true) |
| <kbd>Space</kbd> | Selects the focused option when search input is empty |
| <kbd>Escape</kbd> | Closes the menu without selecting |
| <kbd>Tab</kbd> | Closes the menu and moves focus to next element |
| <kbd>PageDown</kbd> | Jumps focus to the last non-disabled option |
| <kbd>PageUp</kbd> | Jumps focus to the first non-disabled option |
| <kbd>Backspace</kbd> | When search is empty and there are selected values, removes the last selected option (multi-select) or the selected option (single-select) |

### Search Behavior

When `isSearchable` is enabled:
- Typing automatically opens the menu if closed
- Typing filters the available options in real-time
- The focused option updates to the first matching result

### Focus on Blur

By default, when the component loses focus with the menu open, the focused option is automatically selected. You can disable this behavior with the `selectOnBlur` prop:

```vue
<VueSelect
  v-model="selected"
  :options="options"
  :select-on-blur="false"
/>
```

## Focus Management

### Auto-focus Behavior

When the menu opens, the component automatically focuses the first non-disabled option. You can disable this with the `shouldAutofocusOption` prop:

```vue
<VueSelect
  v-model="selected"
  :options="options"
  :should-autofocus-option="false"
/>
```

### Disabled Options

Options with the `disabled` property are skipped during keyboard navigation and cannot be selected:

```vue
<VueSelect
  v-model="selected"
  :options="[
    { label: 'Available', value: '1' },
    { label: 'Unavailable', value: '2', disabled: true }
  ]"
/>
```

### Visual Focus Indicator

Focused options receive the `.focused` CSS class, which applies visual styling (default: light blue background). You can customize this through CSS variables:

```css
:root {
  --vs-option-focused-background-color: #dbeafe;
  --vs-option-focused-text-color: #18181b;
}
```

### Viewport Scrolling

When navigating with keyboard, the component automatically scrolls focused options into view if they're outside the menu's visible area. This ensures users never lose track of the focused option.

## Screen Reader Support

### Announced Changes

Screen readers announce:
- When the menu opens/closes via `aria-expanded`
- The current selection via `aria-label` on the combobox
- The focused option as users navigate with keyboard
- Whether options are selected via `aria-selected`
- Whether options are disabled via `aria-disabled`
- The number of available options (via the listbox)

### Value Container Label

The combobox's `aria-label` dynamically updates to reflect the current selection:

```html
<!-- Single select: "Option Label" -->
<div aria-label="Apple">

<!-- Multi-select: "Option 1, Option 2, Option 3" -->
<div aria-label="Apple, Banana, Cherry">
```

### Non-searchable Mode

When `isSearchable` is `false`, the search input receives additional attributes to hide it from screen readers:

```html
<input
  readonly
  tabindex="-1"
  aria-hidden="true"
>
```

This prevents screen readers from announcing the input, as it serves no purpose when search is disabled.

## Input Attributes

You can pass additional HTML attributes to the search input via the `inputAttrs` prop for enhanced accessibility:

```vue
<VueSelect
  v-model="selected"
  :options="options"
  :input-attrs="{
    'aria-describedby': 'helper-text',
    'aria-invalid': hasError,
    'aria-errormessage': hasError ? 'error-message' : undefined
  }"
/>
```

See the [Input Attributes guide](/guides/input-attributes) for more details.

## Unique IDs

Each select instance automatically generates a unique ID (via the `uid` prop) to ensure proper ARIA relationships between elements:

```html
<!-- Combobox -->
<div id="vue-select-1-combobox" role="combobox" aria-controls="vue-select-1-listbox">

<!-- Listbox -->
<div id="vue-select-1-listbox" role="listbox">
```

You can provide a custom UID if needed:

```vue
<VueSelect
  v-model="selected"
  :options="options"
  uid="custom-select-id"
/>
```

## Resources

- [WAI-ARIA Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
