<br />

<p align="center">
  <a href="https://vue3-select-component.vercel.app/">
    <img src="https://vue3-select-component.vercel.app/logo.png" alt="Vue 3 Select Component" height="256" width="256" />
  </a>
</p>

<h1 align="center">
  Vue 3 Select Component
</h1>

<p align="center">
  Accessible select for Vue 3. Type-safe, customizable, with a batteries-included <code>Select</code> or headless primitives.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue3-select-component" target="_blank">
    <img src="https://img.shields.io/npm/v/vue3-select-component.svg?style=flat" alt="npm version" />
  </a>

  <a href="https://www.npmjs.com/package/vue3-select-component" target="_blank">
    <img src="https://img.shields.io/npm/dm/vue3-select-component?style=flat" alt="npm downloads" />
  </a>

  <a href="https://github.com/TotomInc/vue3-select-component" target="_blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/TotomInc/vue3-select-component?style=flat">
  </a>
</p>

<p align="center">
  <a href="https://vue3-select-component.vercel.app/" target="_blank">Documentation</a>
  ·
  <a href="https://vue3-select-component.vercel.app/getting-started/usage" target="_blank">Getting Started</a>
  ·
  <a href="https://vue3-select-component.vercel.app/guide/primitives" target="_blank">Primitives</a>
  ·
  <a href="https://vue3-select-component.vercel.app/guide/migration" target="_blank">v0 Migration</a>
</p>

> **v0** users, see the [migration guide](https://vue3-select-component.vercel.app/guide/migration). v0 documentation remains at [v0-vue3-select-component.vercel.app](https://v0-vue3-select-component.vercel.app/) on the `v0` branch.

## What is Vue 3 Select Component?

Headless select built on two APIs that share the same state machine, accessibility behavior, and TypeScript types:

| API | Import | Best for |
|-----|--------|----------|
| **Assembled `Select`** | `vue3-select-component` | Drop-in select with search, clear, multi-select, and sensible defaults |
| **Primitives** | `vue3-select-component/primitives` | Custom UX such as infinite scroll, virtualized lists, or non-standard layouts |

The assembled `Select` is a fixed composition of primitives. It is not a separate implementation.

When defaults are not enough, compose primitives directly or mix both approaches.

## Features

- **Two-way binding** with `v-model` for single and multi-select
- **End-to-end types** that tie `option.value` to `v-model`
- **Search and filter** with custom `filterBy` logic (search is on by default on assembled `Select`)
- **Clear, loading, and disabled states** with familiar boolean props
- **Option groups** via `SelectGroup`, `SelectGroupLabel`, and `SelectSeparator` primitives
- **Create new options** with `createItem` on assembled `Select` or `SelectRoot`
- **Accessible by default** following the WAI-ARIA combobox pattern
- **Teleport the menu** to `document.body` by default (Reka UI Popover under the hood)
- **Style your way** with optional `--vs-*` CSS variables, or fully unstyled primitives with `data-*` hooks
- **Light bundle** with Vue 3.5+ and [Reka UI](https://reka-ui.com/) as the only runtime dependency

## Requirements

- [Vue.js](https://vuejs.org) **3.5+**

## Installation

```bash
pnpm add vue3-select-component
```

```bash
npm install vue3-select-component
```

## Quick start

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

Styles are opt-in and imported manually (CSP-friendly). You can also import `vue3-select-component/styles.css` directly.

### Multi-select, clear, and search

```vue
<Select
  v-model="selectedTags"
  multiple
  clearable
  :options="options"
  placeholder="Search and select"
/>
```

| Mode | `v-model` type | Default |
|------|----------------|---------|
| Single | `string \| number \| null` | `null` |
| Multi | `(string \| number)[]` | `[]` |

Disable search with `:searchable="false"` when you want a button-only select.

## Import paths

| Import | Description |
|--------|-------------|
| `vue3-select-component` | Assembled `Select` (default export) |
| `vue3-select-component/primitives` | Headless primitive components |
| `vue3-select-component/styles` | Default assembled styles (`--vs-*` variables) |
| `vue3-select-component/styles.css` | Same stylesheet (explicit `.css` subpath) |

## Primitives

Compose custom selects from low-level building blocks:

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  SelectInput,
  SelectListbox,
  SelectNoOptions,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";
import "vue3-select-component/styles";

const model = ref<string | null>(null);

const options = [
  { value: "js", label: "JavaScript" },
  { value: "ts", label: "TypeScript" },
];
</script>

<template>
  <SelectRoot
    v-model="model"
    :options="options"
    searchable
  >
    <SelectTrigger>
      <SelectValue placeholder="Pick a language" />
      <SelectInput />
      <SelectTrailingIcon />
    </SelectTrigger>

    <SelectPopover>
      <SelectListbox>
        <SelectNoOptions>No results</SelectNoOptions>
        <SelectOption
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          :label="opt.label"
        />
      </SelectListbox>
    </SelectPopover>
  </SelectRoot>
</template>
```

Available primitives include `SelectRoot`, `SelectTrigger`, `SelectValue`, `SelectInput`, `SelectIcon`, `SelectTrailingIcon`, `SelectClear`, `SelectPopover`, `SelectListbox`, `SelectOption`, `SelectGroup`, `SelectGroupLabel`, `SelectSeparator`, `SelectTag`, `SelectNoOptions`, and `SelectCreateItem`.

Advanced patterns such as virtualized lists, infinite scroll, and remote data fetching are documented as primitives recipes, not assembled `Select` APIs. See the [complex use cases guide](https://vue3-select-component.vercel.app/guide/complex-use-cases).

## TypeScript

Option values and `v-model` stay in sync through generics:

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

See the [TypeScript guide](https://vue3-select-component.vercel.app/guide/typescript) for model types, custom option shapes, and primitive generics.

## Styling

Import `vue3-select-component/styles` for the assembled `Select`, then customize with `--vs-*` CSS variables. Primitives ship unstyled and expose stable `data-*` hooks for your design system.

See the [styling guide](https://vue3-select-component.vercel.app/guide/styling).

## Nuxt

Works in Nuxt 3 and 4 with no dedicated module. Import the stylesheet once in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ["vue3-select-component/styles"],
});
```

See the [Nuxt guide](https://vue3-select-component.vercel.app/guide/nuxt) for SSR, SSG, and hydration notes.

## Migrating from v0

Still on v0? See the [v0 documentation](https://v0-vue3-select-component.vercel.app/).

See the full [migration guide](https://vue3-select-component.vercel.app/guide/migration) from v0 to v1.

## Contributing & development

This repository is a pnpm workspace:

| Package | Path | Purpose |
|---------|------|---------|
| `vue3-select-component` | `src/` | Published library |
| `@vue3-select-component/playground` | `playground/` | Interactive demos |
| `@vue3-select-component/docs` | `docs/` | Documentation site ([vue3-select-component.vercel.app](https://vue3-select-component.vercel.app/)) |

### Getting started

1. Clone the repository and check out `v1-dev`
2. Install dependencies: `pnpm install`
3. Start local development: `pnpm run dev`

`pnpm run dev` watch-builds the library and runs the playground. The playground resolves library source from `src/` for fast feedback during component work.

### Workspace scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Watch-build lib + styles, run playground |
| `pnpm run dev:lib` | Watch-build lib + styles only |
| `pnpm run dev:playground` | Playground dev server only |
| `pnpm run dev:docs` | Documentation dev server |
| `pnpm run docs:dev` | Watch-build lib + docs dev server |
| `pnpm run docs:build` | Build lib + generate static docs |
| `pnpm run build` | Build all workspace packages |
| `pnpm run test` | Run library tests with coverage |
| `pnpm run lint` | Lint the monorepo |

### Library build output

| Output | Description |
|--------|-------------|
| `dist/index.es.js` | Assembled `Select` entry |
| `dist/primitives.js` | Headless primitives entry |
| `dist/styles.css` | Minified default styles |

### Contributing guidelines

- **Branching** — `v1-dev` for v1 integration, `master` for releases, `v0` for v0 maintenance
- **Commits** — Conventional commits
- **Tests** — PRs should include tests and pass `pnpm run test` and `pnpm run build`
- **Docs** — Update `docs/` when changing public API or behavior

## Releases

Changelog and release notes are on [GitHub Releases](https://github.com/TotomInc/vue3-select-component/releases).

## Sponsors

<p align="center">
  <a href="https://www.heapform.com/" target="_blank">
    <img src=".github/assets/sponsors/heapform.png" alt="Heapform" height="48" />
  </a>
</p>

## License

MIT Licensed. Copyright (c) Thomas Cazade 2024 - present.
