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
 <a href="https://vue3-select-component.vercel.app/" target="__blank">Documentation</a> | <a href="https://vue3-select-component.vercel.app/getting-started/usage" target="__blank">Getting Started</a> | <a href="https://vue3-select-component.vercel.app/guide/primitives" target="__blank">Primitives</a>
</p>

**Core features:**

- ⚙️ Data manipulation with `v-model`
- 🔑 [Typesafe relationship](https://vue3-select-component.vercel.app/guide/typescript) between `options` and `v-model`
- 🎨 Default styles with `--vs-*` CSS variables, or fully headless primitives
- ✅ Single & multi-select support
- 🧱 Assembled `Select` or composable primitives
- 🪄 `<Teleport />` menu where you want
- 📦 Light bundle, minimal dependencies

## Installation

Install the package with your package manager:

```bash
npm i vue3-select-component
```

Import the assembled component and its default styles:

```vue
<script setup lang="ts">
import { ref } from "vue";
import Select from "vue3-select-component";
import "vue3-select-component/styles";

const selected = ref<string | null>(null);
</script>

<template>
  <Select
    v-model="selected"
    :options="[
      { label: 'A Wizard of Earthsea', value: 'wizard_earthsea' },
      { label: 'Harry Potter and the Philosopher\'s Stone', value: 'harry_potter', disabled: true },
      { label: 'The Lord of the Rings', value: 'the_lord_of_the_rings' },
    ]"
    placeholder="Select a book"
  />
</template>
```

Styles are opt-in and must be imported manually (CSP-friendly). You can also import `vue3-select-component/styles.css` directly.

Primitives ship unstyled. See the [styling guide](https://vue3-select-component.vercel.app/guide/styling).

## Advanced TypeScript usage

Vue 3 Select Component creates a type-safe relationship between `option.value` and `v-model`.

```vue
<script setup lang="ts">
import type { SelectOptionData } from "vue3-select-component";
import { ref } from "vue";
import Select from "vue3-select-component";
import "vue3-select-component/styles";

type UserOption = SelectOptionData<number> & { username: string };

const selectedUser = ref<number | null>(null);

const userOptions: UserOption[] = [
  { label: "Alice", value: 1, username: "alice15" },
  { label: "Bob", value: 2, username: "bob01" },
  { label: "Charlie", value: 3, username: "charlie20" },
];
</script>

<template>
  <Select
    v-model="selectedUser"
    :options="userOptions"
    :get-option-label="(option) => `${option.label} (${option.username})`"
    placeholder="Pick a user"
  />
</template>
```

[See the TypeScript guide](https://vue3-select-component.vercel.app/guide/typescript) for primitives, model types, and generics.

## Contributing & Development

This repository is a pnpm workspace with three packages:

| Package | Path | Purpose |
|---------|------|---------|
| `vue3-select-component` | `src/` | Published library |
| `@vue3-select-component/playground` | `playground/` | Interactive demos |
| `@vue3-select-component/docs` | `docs/` | Documentation site |

### Getting started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start local development: `pnpm run dev`

`pnpm run dev` runs the library watch build and the playground together. The playground resolves component source from `src/` directly, so changes are reflected without publishing.

### Workspace scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Watch-build lib + styles, run playground |
| `pnpm run dev:lib` | Watch-build lib + styles only |
| `pnpm run dev:playground` | Playground dev server only |
| `pnpm run dev:docs` | Documentation dev server |
| `pnpm run docs:dev` | Watch-build lib + docs dev server |
| `pnpm run build` | Build all workspace packages |
| `pnpm run test` | Run library tests |
| `pnpm run lint` | Lint the monorepo |

### Library build output

The library build produces:

- `dist/index.es.js` — assembled `Select` entry
- `dist/primitives.js` — headless primitives entry
- `dist/styles.css` — minified default styles (`vue3-select-component/styles`)

### Contributing

- 🌿 **Branching** — `v1-dev` for integration, `master` for releases
- 📝 **Commits** — Conventional commits
- 🧪 **Tests** — All PRs need tests and type safety (`pnpm run test`, `pnpm run build`)
- 📖 **Docs** — Update `docs/` when changing public API or behavior

## Releases

For changelog, visit [releases](https://github.com/TotomInc/vue3-select-component/releases).

## License

MIT Licensed. Copyright (c) Thomas Cazade 2024 - present.
