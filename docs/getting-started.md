---
title: 'Getting Started'
---

# Getting Started

## Installation

Vue 3 Select Component can be installed using your favorite package manager:

::: code-group
```sh [npm]
$ npm add -D vue3-select-component
```

```sh [pnpm]
$ pnpm add -D vue3-select-component
```

```sh [yarn]
$ yarn add -D vue3-select-component
```

```sh [bun]
$ bun add -D vue3-select-component
```
:::

::: tip
[Vue.js](https://vuejs.org) 3.4+ is required to use this component.
:::

## Usage

Import the component with the styling, and use it in your Vue 3 application:

```vue
<script setup lang="ts">
import "vue3-select-component/dist/style.css";

import { ref } from "vue";
import VueSelect from "vue3-select-component";

const selected = ref<string | null>(null);
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

## Data binding

Vue 3 Select Component takes advantage of Vue's `v-model`, which means you can use it with `v-model` to bind the selected value(s) to a variable.

This makes it easy to use the component anywhere in your application, while being reactive and easy to work with.
