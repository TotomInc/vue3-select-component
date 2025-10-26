---
title: 'Getting Started'
---

# Getting Started

## Installation

Vue 3 Select Component can be installed using your favorite package manager:

::: code-group
```sh [npm]
$ npm add vue3-select-component
```

```sh [pnpm]
$ pnpm add vue3-select-component
```

```sh [yarn]
$ yarn add vue3-select-component
```

```sh [bun]
$ bun add vue3-select-component
```
:::

::: tip
[Vue.js](https://vuejs.org) 3.5+ is required to use this component.

The component uses [Floating UI](https://floating-ui.com/) for intelligent menu positioning and viewport detection.
:::

## CSS Styles

The component requires its CSS styles to be imported manually.

```javascript
import "vue3-select-component/styles";
```

::: info
These styles can be imported in your application entry point (e.g. `main.ts`) or in a specific SFC where you are using the component (e.g. `MyComponent.vue`).
:::

## Single select usage

Import the component and its styles, and use it in your Vue 3 application:

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";
import "vue3-select-component/styles";

const selected = ref("");
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="[
      { label: 'Option #1', value: 'option_1' },
      { label: 'Option #2', value: 'option_2' },
      { label: 'Option #3', value: 'option_3' },
    ]"
    placeholder="Select an option"
  />
</template>
```

Since the component is built with TypeScript, your IDE will provide you with autocompletion and type checking automatically.

## Multiselect usage

Import the component and its styles, and use it in your Vue 3 application.

To enable the multiselect feature, all you need to do is:

- set the `is-multi` prop to `true`
- use an array for the `v-model`

```vue
<script setup>
import { ref } from "vue";
import VueSelect from "vue3-select-component";
import "vue3-select-component/styles";

const selected = ref([]);
</script>

<VueSelect
  v-model="selected"
  :is-multi="true"
  :options="[
    { label: 'Option #1', value: 'option_1' },
    { label: 'Option #2', value: 'option_2' },
    { label: 'Option #3', value: 'option_3' },
  ]"
/>
```

## Data binding

Vue 3 Select Component takes advantage of Vue's `v-model`, which means you can use it with `v-model` to bind the selected value(s) to a variable.

This makes it easy to use the component anywhere in your application, while being reactive and easy to work with.

[Learn more about `v-model`](https://vuejs.org/guide/components/v-model.html).
