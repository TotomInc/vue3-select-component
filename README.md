# Vue3-Select-Component

A select component for Vue 3 which helps you to develop a _simple yet powerful_ select control with ease that works out-of-the-box, while still allowing you to customize it to your needs.

This component includes the following features:

- Easy data manipulation with `v-model`
- Great styling out-of-the-box, customization with CSS variables & Vue `:deep`
- Single & multi-select
- Deep customization with `<slot>`s
- Teleport/portal menu

## Installation

Install the package with npm:

```bash
npm i vue3-select-component
```

Use it in your Vue 3 app:

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";

const option = ref("");
</script>

<template>
  <div class="my-app">
    <VueSelect
      v-model="option"
      :options="[
        { label: 'A Wizard of Earthsea', value: 'wizard_earthsea' },
        { label: 'Harry Potter and the Philosopher\'s Stone', value: 'harry_potter' },
        { label: 'The Lord of the Rings', value: 'the_lord_of_the_rings' },
      ]"
    />
  </div>
</template>
```

## API

### Common types

Here are some common types that are used in the API:

```ts
type Option = {
  label: string;
  value: string;
  [key: string]: any;
};
```

### Props

**v-model**: `string | string[]`

The value of the select. If `isMulti` is `true`, the `v-model` should be an array of string `string[]`.

**options**: `Option[]`

A list of options to choose from. Each option should have a `label` and a `value` property. You can add any other properties to the options, which will be passed to the `option` slot.

**autoscroll**: `boolean` (default: `true`)

Whether the dropdown should automatically scroll to the selected option, when using keyboard navigation.

**placeholder**: `string` (default: `Select an option`)

The placeholder text to show when no option is selected.

**isClearable**: `boolean` (default: `true`)

Whether the select should have a clear button to reset the selected value.

**isDisabled**: `boolean` (default: `false`)

Whether the select should be disabled.

**isSearchable**: `boolean` (default: `true`)

Whether the select should have a search input to filter the options.

**isMulti**: `boolean` (default: `false`)

Whether the select should allow multiple selections. If `true`, the `v-model` should be an array of string `string[]`.

**closeOnSelect**: `boolean` (default: `true`)

Whether the dropdown should close after an option is selected.

**teleport**: `string` (default: `undefined`)

Teleport the menu outside of the component DOM tree. You can pass a valid string according to the official Vue 3 Teleport documentation (e.g. `teleport="body"` will teleport the menu into the `<body>` tree). This can be used in case you are having `z-index` issues within your DOM tree structure.

**Note**: top and left properties are calculated using a ref on the `.vue-select` with a `container.getBoundingClientRect()`.

**getOptionLabel**: `(option: Option) => string` (default: `option => option.label`)

A function to get the label of an option. This is useful when you want to use a property different from `label` as the label of the option.

This function is used to display the options in the dropdown, and to display the selected option (**single-value**) in the select.

**getMultiValueLabel**: `(option: Option) => string` (default: `option => option.label`)

A function to get the label of an option. This is useful when you want to use a property different from `label` as the label of the option.

This function is used to display the selected options (**multi-value**) in the select.

### Customization

There are 2 types of customization available in the component.

#### CSS variables

CSS variables is the easiest way to customize the component style but provides less flexibility over your design. When importing the component, you will notice that CSS variables are injected into the `:root` scope and are prefixed with `--vs-select-[...]`.

For a complete list of CSS variables, we recommend to take a look at the source-code ([`/src/Select.vue`](https://github.com/TotomInc/vue3-select-component/blob/master/src/Select.vue)) or look at your DevTools when using the component _(open DevTools => `Elements` tab => pick `<html />` node => view all CSS variables inside the `:root` scope)_.

#### Scoped styling inside SFC

You can apply any custom styling using [the `:deep` selector](https://vuejs.org/api/sfc-css-features.html#deep-selectors) inside a `<style scoped>`.

Here's an example:

```vue
<style scoped>
:deep(.vue-select) {
  width: 320px;
}

:deep(.vue-select .menu-option) {
  background-color: #f4f4f5;
}
</style>
```

## License

MIT Licensed. Copyright (c) Thomas Cazade 2024.
