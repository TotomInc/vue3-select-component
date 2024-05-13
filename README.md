# Vue3-Select-Component [![npm](https://img.shields.io/npm/v/vue3-select-component.svg)](https://www.npmjs.com/package/vue3-select-component) [![build status](https://github.com/TotomInc/vue3-select-component/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/TotomInc/vue3-select-component/actions/workflows/build.yml) [![Download](https://img.shields.io/npm/dm/vue3-select-component)](https://www.npmjs.com/package/vue3-select-component)

> Best-in-class select component for Vue 3, with a focus on DX, accessibility and ease-of-use.

**Documentation & demos with code**: https://vue3-select-component.vercel.app

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

import "vue3-select-component/dist/style.css";

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

import "vue3-select-component/dist/style.css";

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
