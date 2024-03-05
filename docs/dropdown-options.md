---
title: 'Dropdown Options'
---

# Dropdown Options

## Default format

When using the `options` prop, you can pass an array of objects to the component. Each object should have a `label` and a `value` property. The `label` property is used to display the option in the dropdown, and the `value` property is the value that will be set to the `v-model` when the option is selected.

```vue
<template>
  <VueSelect :options="[{ label: 'Option #1', value: 'option_1' }]" />
</template>
```

## Passing extra properties

You can pass extra properties to the options object. The component will ignore them but you will be able to manipulate those extra properties using some props and slots.

```vue
<template>
  <VueSelect
    :options="[{ label: 'Option #1', value: 'option_1', extra: 'Extra data' }]"
    :get-option-label="(option) => `${option.label} - ${option.extra}`"
  />
</template>
```
