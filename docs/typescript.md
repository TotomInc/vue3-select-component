---
title: 'TypeScript'
---

# TypeScript

In order to provide flexibility with TypeScript, Vue 3 Select Component has been written in TypeScript. This means that you can take advantage of TypeScript's type checking and autocompletion features.

## Generics with Vue & TypeScript

Vue 3 Select Component uses a feature that has been released on Vue 3.3 called [**Generics**](https://vuejs.org/api/sfc-script-setup.html#generics).

Generics allow you to define a type that can be used in multiple places with different types. This is useful when you want to create a component that can be used with different types of data.

A common type taking use of the Vue Generic is the `Option` type, which is used to define the `:options` prop of the select component:

```ts
type Option<T> = {
  label: string;
  value: T;
  disabled?: boolean;
};
```

## Customizing `option.value` type

::: info
Ensure you are familiar with the [`:options` prop](/props#options) before reading this section.
:::

By default, the `value` property of the option object is a `string`. However, it is possible to use a different type, such as a `number`.

To do this, import the `Option` type from the component and define a custom type that extends the `Option` type with a generic type:

```vue
<script setup lang="ts">
import type { Option } from "vue3-select-component";
import { ref } from "vue";
import VueSelect from "vue3-select-component";

// Define a custom type for the option value.
// It takes a generic type that defines the type of the `value` property.
// In this case, the `value` property is a `number`.
type UserOption = Option<number>;

const selectedUser = ref<number>();

const userOptions: UserOption[] = [
  { label: "Alice", value: 1 },
  { label: "Bob", value: 2 },
  { label: "Charlie", value: 3 },
  // ❌ - This will cause a type error because `value` is not a number
  { label: "David", value: "a string" },
];
</script>

<template>
  <VueSelect
    v-model="selectedUser"
    :options="userOptions"
    placeholder="Pick a user"
  />
</template>
```

## Adding properties to `option`

It is possible to **add properties** to the options, while still being type-safe across the `<slot />` and various props.

New option properties will be available on **all available props and slots** that receive the `option` object.

```vue
<script setup lang="ts">
import type { Option } from "vue3-select-component";
import { ref } from "vue";
import VueSelect from "vue3-select-component";

// Define a custom type for the option value with an additional `username` property.
type UserOption = Option<number> & { username: string };

const selectedUser = ref<number>();

const userOptions: UserOption[] = [
  { label: "Alice", value: 1, username: "alice15" },
  { label: "Bob", value: 2, username: "bob01" },
  { label: "Charlie", value: 3, username: "charlie20" },
  { label: "David", value: 4, username: "david30" },
];
</script>

<template>
  <!-- The username property will be available on functions inside the VueSelect component. -->
  <VueSelect
    v-model="selectedUser"
    :options="userOptions"
    :get-option-label="option => `${option.label} (${option.username})`"
    placeholder="Pick a user"
  >
    <!-- The username property is also available on slots that receive an option object. -->
    <template #option="{ option }">
      <span>{{ option.label }} - {{ option.username }}</span>
    </template>
  </VueSelect>
</template>
```

## Type-safety between `option.value` & `v-model`

Vue 3 Select Component creates a type-safe relationship between the `option.value` and the `v-model` prop.

This means that if you have a custom type for the `value` property of the option object, the `v-model` prop will also be type-safe.

```vue
<script setup lang="ts">
import type { Option } from "vue3-select-component";
import { ref } from "vue";
import VueSelect from "vue3-select-component";

type UserOption = Option<number>;

// This `ref()` type implementation is incorrect, as it should
// be `ref<number>()`.
const selectedUser = ref<string>();

const userOptions: UserOption[] = [
  { label: "Alice", value: 1 },
  { label: "Bob", value: 2 },
  { label: "Charlie", value: 3 },
];
</script>

<template>
  <!--
    Our v-model will cause a type error because `ref<string>()`
    cannot be assigned to `Option.value<number>`.
  -->
  <VueSelect
    v-model="selectedUser"
    :options="userOptions"
    placeholder="Pick a user"
  />
</template>
```

## Using custom label/value with options

::: warning
`getOptionValue` and `getOptionLabel` props are not compatible with the type-safety of the component. Therefore, you should use them with caution and only as a last resort.
:::

If you're using the `getOptionValue` or `getOptionLabel` props, there are a few gotchas to be aware of with the types:

- Local array of options cannot be typed as `Option<T>[]`
- When passing the array of options to the component, you need to cast it to `unknown` then `Option<T>[]`.

Here's an example usage of the `getOptionValue` and `getOptionLabel` props with TypeScript:

```vue
<script setup lang="ts">
import type { Option } from "vue3-select-component";

const activeRole = ref<string>("");

// You cannot type the `roleOptions` as `Option<string>[]`.
const roleOptions = [
  { id: "Admin", key: "admin" },
  { id: "User", key: "user" },
  { id: "Guest", key: "guest" },
];
</script>

<template>
  <!-- Casting of the `roleOptions` must be done at the `:options` prop-level. -->
  <VueSelect
    v-model="activeRole"
    :options="(roleOptions as unknown as Option<string>[])"
    :is-multi="false"
    :get-option-label="option => (option.id as string)"
    :get-option-value="option => (option.key as string)"
    placeholder="Pick a role"
  />
</template>
```
