---
title: 'Props'
---

# Props

::: info
This component is **ready to be used in production**. However, if there is a feature you would like to see implemented, feel free to open an issue or submit a pull request.
:::

## v-model

**Type**: `any | any[]`

**Required**: `true`

The value of the select. If `isMulti` is `true`, the `v-model` should be an array of any `any[]`.

::: info
If using TypeScript, you can leverage proper type-safety between `option.value` & `v-model`. By doing this, you don't have an `any` type. Read more about [TypeScript usage](/typescript).
:::

## options

**Type**: `Option[]`

**Required**: `true`

A list of all possible options to choose from. Each option should have a `label` and a `value` property. You can add any other properties to the options, which will be passed to the `option` slot.

**Type interface**:

```ts
type Option<T> = {
  label: string;
  value: T;
  disabled?: boolean;
};
```

::: tip
This type is exported from the component and can be imported in your application.
:::

::: info
If you are using TypeScript, you can leverage proper type-safety between `option.value` & `v-model`. Read more about [TypeScript usage](/typescript).
:::

### option.disabled

**Type**: `boolean`

**Required**: `false`

**Default**: `undefined`

Whether the option should be disabled. When an option is disabled, it cannot be selected nor focused/navigated to using the keyboard. It also benefits from extra aria attributes to improve accessibility.

## displayedOptions

**Type**: `Option[]`

**Required**: `false`

A list of specific options to display inside the option menu. This is useful when you want to create a complex filter logic inside the options menu.

::: warning
When this prop is passed to the component, the `options` prop won't be used anymore for the rendering of the options menu.

However, **it is still used internally to keep track of selected value(s)**.

You should pass a list of all possible options to the `options` prop, and a list of specific options to display inside the option menu to the `displayedOptions` prop.
:::

For more details, see the [custom displayed options](/demo/custom-displayed-options) demo.

## placeholder

**Type**: `string`

**Default**: `Select an option`

The placeholder text to show when no option is selected.

## isClearable

**Type**: `boolean`

**Default**: `true`

Whether the select should have a clear button to reset the selected value.

## isDisabled

**Type**: `boolean`

**Default**: `false`

Whether the select should be disabled.

## isSearchable

**Type**: `boolean`

**Default**: `true`

Whether the select should have a search input to filter the options.

## isMulti

**Type**: `boolean`

**Default**: `false`

Whether the select should allow multiple selections. If `true`, the `v-model` should be an array of string `string[]`.

## isTaggable

**Type**: `boolean`

**Default**: `false`

Whether the select should allow creating a new option if it doesn't exist. When `true`, if the user searches for an option that isn't part of the list, the menu will display a text to ask if the user wants to create this option.

::: info
It is up to the user to intercept the new option (using `@option-created` event) and manipulate its array of options provided with the `:options` prop. It is also recommended to slugify the value received and ensure it is unique.
For more details, see the [Multiple Select Taggable](/demo/multiple-select-taggable) demo.
:::

## isLoading

**Type**: `boolean`

**Default**: `false`

Whether the select should display a loading state. When `true`, the select will show a loading spinner or custom loading content provided via the `loading` slot.

## isMenuOpen

**Type**: `boolean`

**Default**: `undefined`

A prop to control the menu open state programmatically. When set to `true`, the menu will be open. When set to `false`, the menu will be closed.

## hideSelectedOptions

**Type**: `boolean`

**Default**: `true`

When set to `true` with `isMulti`, selected options won't appear in the options menu. Set it to `false` to show selected options in the menu.

## shouldAutofocusOption

**Type**: `boolean`

**Default**: `true`

Whether the first option should be focused when the dropdown is opened. If set to `false`, the first option will not be focused, and the user will have to navigate through the options using the keyboard.

## closeOnSelect

**Type**: `boolean`

**Default**: `true`

Whether the dropdown should close after an option is selected.

## teleport

**Type**: `string`

**Default**: `undefined`

Teleport the menu outside of the component DOM tree. You can pass a valid string according to the official Vue 3 Teleport documentation (e.g. `teleport="body"` will teleport the menu into the `<body>` tree). This can be used in case you are having `z-index` issues within your DOM tree structure.

::: info
The menu positioning is powered by [Floating UI](https://floating-ui.com/), which automatically handles positioning, flipping, and shifting to ensure the menu stays visible within the viewport. The menu width is automatically matched to the select control width.
:::

## inputId

**Type**: `string`

**Default**: `undefined`

The `id` attribute to be passed to the `<input />` element. This is useful for accessibility or forms.

## inputAttrs

**Type**: `Record<string, string | number | boolean | undefined | null | Array<unknown>>`

**Default**: `undefined`

HTML attributes to apply to the search input element. This is useful for form integration and accessibility.

Common use cases include:
- `tabindex` - Control tab order in forms
- `autocomplete` - Enable browser autocomplete (e.g., "country", "username")
- `required` - Mark field as required for form validation
- `data-*` - Custom data attributes for testing or analytics
- Any other valid HTML input attributes

**Example:**

```vue
<template>
  <VueSelect
    v-model="country"
    :options="countries"
    :input-attrs="{
      'tabindex': 2,
      'autocomplete': 'country',
      'required': true,
      'data-testid': 'country-select',
    }"
  />
</template>
```

::: info
User-provided attributes override the default attributes. Default attributes include:
- `autocapitalize: "none"`
- `autocomplete: "off"`
- `autocorrect: "off"`
- `spellcheck: false`
- `tabindex: 0`
- `type: "text"`
:::

## classes

**Type**:

```ts
type SelectClasses = {
  container?: string;
  control?: string;
  valueContainer?: string;
  placeholder?: string;
  singleValue?: string;
  multiValue?: string;
  multiValueLabel?: string;
  multiValueRemove?: string;
  inputContainer?: string;
  searchInput?: string;
  menuContainer?: string;
  menuOption?: string;
  noResults?: string;
  taggableNoOptions?: string;
};
```

**Default**: `undefined`

CSS classes to be applied at multiple places in the select component. Useful when using TailwindCSS to customize the component.

## uid

**Type**: `string | number`

**Default**: `number`

A unique identifier to be passed to the select control. Will be used on multiple `id` attributes for accessibility purposes such as `aria-owns`, `aria-controls`, etc.

## aria

**Type**: `{ labelledby?: string; required?: boolean; }`

**Default**: `undefined`

Aria attributes to be passed to the select control to improve accessibility.

## disableInvalidVModelWarn

**Type**: `boolean`

**Default**: `false`

When set to true, the component will not emit a `console.warn` because of an invalid `v-model` type when using `isMulti`. This is useful when using the component with dynamic `v-model` references.

## filterBy

**Type**:

```ts
(option: Option, label: string, search: string) => boolean;
```

**Default**:

```ts
(option, label, search) => label.toLowerCase().includes(search.toLowerCase());
```

Callback function to determine if the current option should match the search query. This function is called for each option and should return a boolean.

The `label` is provided as a convenience, processed from `getOptionLabel` prop.

::: info
By default, the following callback function is used `(option, label, search) => label.toLowerCase().includes(search.toLowerCase())`
:::

## getOptionLabel

**Type**:

```ts
(option: Option) => string;
```

**Default**:

```ts
(option) => option.label;
```

Resolves option data to a string to render the option label.

This function can be used if you don't want to use the standard `option.label` as the label of the option.

The label of an option is displayed in the dropdown and as the selected option (**single-value**) in the select.

## getOptionValue

**Type**:

```ts
(option: Option) => string;
```

**Default**:

```ts
(option) => option.value;
```

Resolves option data to a string to compare options and specify value attributes.

This function can be used if you don't want to use the standard `option.value` as the value of the option.
