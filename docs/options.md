---
title: 'Options'
---

# Options

The `options` prop is the core configuration for populating the dropdown menu. Understanding how to structure your options is essential for effective component usage.

## Basic structure

Each option requires two key properties:

```vue
<template>
  <VueSelect 
    :options="[
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' }
    ]"
  />
</template>
```

**Properties:**

- `label`: Text displayed in the dropdown menu
- `value`: Data bound to `v-model` when the option is selected

::: info
For TypeScript users, import the `Option` type to ensure proper type checking:

```ts
import type { Option } from "vue3-select-component";

const options: Option<string>[] = [{ label: 'JavaScript', value: 'js' }];
```
:::

## Disabling options

Individual options can be disabled by adding the `disabled` property:

```vue
<template>
  <VueSelect 
    :options="[
      { label: 'Available', value: 'a1' },
      { label: 'Unavailable', value: 'a2', disabled: true }
    ]"
  />
</template>
```

Disabled options:

- Cannot be selected
- Cannot be focused with keyboard navigation
- Have distinct visual styling
- Include proper ARIA attributes for accessibility

## Extended Properties

Options can include additional properties beyond the standard `label`/`value` pair:

```vue
<template>
  <VueSelect
    :options="[
      { 
        label: 'JavaScript',
        value: 'js',
        version: 'ES2022',
        creator: 'Brendan Eich'
      }
    ]"
    :get-option-label="option => `${option.label} (${option.version})`"
  >
    <template #option="{ option }">
      {{ option.label }} - Created by {{ option.creator }}
    </template>
  </VueSelect>
</template>
```

::: info
When using extended properties with TypeScript, extend the `Option` type:

```ts
type LanguageOption = Option<string> & {
  version: string;
  creator: string;
};
```

For more details, see the [Extending option properties guide](./typescript.md#extending-option-properties).
:::
