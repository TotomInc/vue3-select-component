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

For more details, see the [With complex menu filter](/demo/with-complex-menu-filter) demo.

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

## isLoading

**Type**: `boolean`

**Default**: `false`

Whether the select should display a loading state. When `true`, the select will show a loading spinner or custom loading content provided via the `loading` slot.

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
Top and left properties are calculated using a ref on the `.vue-select` with a `container.getBoundingClientRect()`.
:::

## inputId

**Type**: `string`

**Default**: `undefined`

The `id` attribute to be passed to the `<input />` element. This is useful for accessibility or forms.

## aria

**Type**: `{ labelledby?: string; required?: boolean; }`

**Default**: `undefined`

Aria attributes to be passed to the select control to improve accessibility.

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

The `label` is provided as a convenience, using `getOptionLabel` or `getMultiValueLabel` depending on the `isMulti` prop.

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

A function to get the label of an option. This is useful when you want to use a property different from `label` as the label of the option.

This function is used to display the options in the dropdown, and to display the selected option (**single-value**) in the select.

## getMultiValueLabel

**Type**:

```ts
(option: Option) => string;
```

**Default**:

```ts
(option) => option.label;
```

A function to get the label of an option. This is useful when you want to use a property different from `label` as the label of the option.

This function is used to display the selected options (**multi-value**) in the select.
