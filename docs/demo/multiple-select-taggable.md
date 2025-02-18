---
title: 'Multiple Select Taggable'
---

# Multiple Select Taggable

The following example demonstrates how to use the `VueSelect` component to create a multiple select dropdown with taggable options _(options that are created by the user)_.

::: warning
Setting `is-multi` to `true` will change the `v-model` to become an array of any `any[]`. Make sure to update your `v-model` accordingly.
:::

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";

const selected = ref([]);

const options = ref([
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
]);

const handleCreateOption = (value) => {
  options.value.push({ label: value, value });
  selected.value.push(value);
};
</script>

<ClientOnly>
  <VueSelect
    v-model="selected"
    :is-multi="true"
    :is-taggable="true"
    :options="options"
    @option-created="(value) => handleCreateOption(value)"
  />
</ClientOnly>

Selected value(s): **{{ selected.length ? selected.join(", ") : "none" }}**

## Demo source-code

```vue
<script setup lang="ts">
import type { Option } from "vue3-select-component";
import { ref } from "vue";
import VueSelect from "vue3-select-component";

// When setting `is-multi` to `true`, the `v-model` should be an array of strings.
const selected = ref<string[]>([]);

const options = ref<Option<string>>([
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
]);

const handleCreateOption = (value) => {
  options.value.push({ label: value, value });
  selected.value.push(value);
};
</script>

<template>
  <VueSelect
    v-model="selected"
    :is-multi="true"
    :is-taggable="true"
    :options="options"
    @option-created="(value) => handleCreateOption(value)"
  />
</template>
```
