<br />

<p align="center">
  <a href="https://vue3-select-component.vercel.app/">
    <img src="https://vue3-select-component.vercel.app/logo.png" alt="Vue3 Select Component" height="256" width="256" />
  </a>
</p>

<h1 align="center">
  Vue3-Select-Component
</h1>

<p align="center">
  Best-in-class select component for Vue 3, with a focus on DX, accessibility and ease-of-use.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue3-select-component" target="__blank">
    <img src="https://img.shields.io/npm/v/vue3-select-component.svg?style=flat" alt="npm package" />
  </a>

  <a href="https://www.npmjs.com/package/vue3-select-component" target="__blank">
    <img src="https://img.shields.io/npm/dm/vue3-select-component?style=flat" alt="npm package" />
  </a>

  <a href="https://github.com/TotomInc/vue3-select-component" target="__blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/TotomInc/vue3-select-component?flat">
  </a>
</p>

<p align="center">
 <a href="https://vue3-select-component.vercel.app/" target="__blank">Documentation</a> | <a href="https://vue3-select-component.vercel.app/getting-started.html" target="__blank">Getting Started</a> | <a href="https://vue3-select-component.vercel.app/demo/single-select.html" target="__blank">Examples / Demos</a>
</p>

**Core features:**

- ⚙️ Data manipulation with `v-model`
- 🔑 [Typesafe relationship](https://vue3-select-component.vercel.app/typescript.html) between `options` and `v-model`
- 🎨 Great styling out-of-the-box, customization with CSS variables & Vue `:deep`
- ✅ Single & multi-select support
- 🖌️ Infinite customization with `<slot>`s
- 🪄 `<Teleport />` menu where you want
- 📦 Extremely light, minimal dependencies (17kb gzip)

## Installation

Install the package with npm:

```bash
npm i vue3-select-component
```

::: info
The component requires its CSS styles to be imported manually.

```javascript
import "vue3-select-component/styles";
```
:::

Use it in your Vue 3 app:

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";
import "vue3-select-component/styles";

const option = ref("");
</script>

<template>
  <div class="my-app">
    <VueSelect
      v-model="option"
      :options="[
        { label: 'A Wizard of Earthsea', value: 'wizard_earthsea' },
        { label: 'Harry Potter and the Philosopher\'s Stone', value: 'harry_potter', disabled: true },
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
import type { Option } from "vue3-select-component";
import { ref } from "vue";
import VueSelect from "vue3-select-component";
import "vue3-select-component/styles";

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

[There's an entire documentation page](https://vue3-select-component.vercel.app/typescript.html) dedicated to usage with TypeScript.

## Contributing & Development

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the playground: `npm run dev:playground`
4. Run tests: `npm run test`

### Contributing

- 🌿 **Branching strategy** - We use `dev` for integration and `master` for releases
- 🚀 **Release process** - How to create prereleases and stable releases
- 📝 **Commit conventions** - We follow conventional commits
- 🧪 **Testing requirements** - All PRs need tests and type safety
- 📖 **Documentation** - How to add examples and update docs

### Development documentation

The `dev` branch documentation can be found at:

https://dev-vue3-select-component.vercel.app/

This documentation is automatically generated from the `dev` branch and is updated with each commit.

**Note**: it doesn't reflect the latest stable release.

## Releases

For changelog, visit [releases](https://github.com/TotomInc/vue3-select-component/releases).

## License

MIT Licensed. Copyright (c) Thomas Cazade 2024 - present.
