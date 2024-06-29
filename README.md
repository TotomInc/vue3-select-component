# Vue3-Select-Component

<p align="center">
  <img src="https://vue3-select-component.vercel.app/logo.png" alt="Vue3 Select Component" height="256" width="256" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue3-select-component">
    <img src="https://img.shields.io/npm/v/vue3-select-component.svg" alt="npm package" />
  </a>

  <a href="https://www.npmjs.com/package/vue3-select-component">
    <img src="https://img.shields.io/npm/dm/vue3-select-component" alt="npm package" />
  </a>

  <a href="https://github.com/TotomInc/vue3-select-component/actions/workflows/build.yml">
    <img src="https://github.com/TotomInc/vue3-select-component/actions/workflows/build.yml/badge.svg?branch=master" alt="CI status" />
  </a>
</p>

<p align="center">
  <b>Docs & demos</b>: <a href="https://vue3-select-component.vercel.app">vue3-select-component.vercel.app</a>
</p>

> Best-in-class select component for Vue 3, with a focus on DX, accessibility and ease-of-use.

- ⚙️ Data manipulation with `v-model`
- 🔑 Type-safe
- 🎨 Great styling out-of-the-box, customization with CSS variables & Vue `:deep`
- ✅ Single & multi-select
- 🖌️ Customization with `<slot>`s
- 🪄 Teleport/portal menu
- 📦 Extremely light (3.1kb gzip)

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

## Advanced TypeScript usage

Vue 3 Select Component creates a type-safe relationship between the `option.value` and the `v-model` prop.

It also leverages the power of generics to provide types for additional properties on the options.

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect, { type Option } from "vue3-select-component";

type UserOption = Option<number> & { username: string };

const selectedUser = ref<number>();

const userOptions: UserOption[] = [
  { label: "Alice", value: 1, username: "alice15" },
  { label: "Bob", value: 2, username: "bob01" },
  { label: "Charlie", value: 3, username: "charlie20" },
];
</script>

<template>
  <VueSelect
    v-model="selectedUser"
    :options="userOptions"
    :get-option-label="(option) => `${option.label} (${option.username})`"
    placeholder="Pick a user"
  />
</template>
```

## License

MIT Licensed. Copyright (c) Thomas Cazade 2024 - present.
