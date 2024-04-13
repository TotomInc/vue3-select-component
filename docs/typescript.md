---
title: 'TypeScript'
---

# TypeScript

In order to provide flexibility with TypeScript, Vue 3 Select Component has been written in TypeScript. This means that you can take advantage of TypeScript's type checking and autocompletion features.

## About generics in TypeScript & Vue

Vue 3 Select Component uses a feature that has been released on Vue 3.3 called [**Generics**](https://vuejs.org/api/sfc-script-setup.html#generics).

Generics allow you to define a type that can be used in multiple places with different types. This is useful when you want to create a component that can be used with different types of data.

A common type you'll see is the `Option` type, which is used to define the options of the select component.

```typescript
type Option<T> = {
  label: string;
  value: T;
};
```

## Custom option value

::: info
Ensure you are familiar with the [`:options` prop](/props#options) before reading this section.
:::

By default, the `value` property of the option object is a `string`. However, it is possible to use a custom type, such as a `number` or a complex object.

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect, { type Option } from "vue3-select-component";

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

## Custom option properties

It is possible to **add properties** to the options passed inside the `:options` prop, while still being type-safe.

Let's say you want to add a `username` property to the option object.

This `username` property will be available on **all available props and slots** that receive the `option` object.

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

## Type-safe relationship between `option.value` & `v-model`

Vue 3 Select Component creates a type-safe relationship between the `option.value` and the `v-model` prop.

This means that if you have a custom type for the `value` property of the option object, the `v-model` prop will also be type-safe.

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect, { type Option } from "vue3-select-component";

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
