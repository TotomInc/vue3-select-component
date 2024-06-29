---
title: 'Pre-selected values (single select & multi-select)'
---

# Pre-selected values

The following example demonstrates how to use the `VueSelect` component with pre-selected values.

This can be achieved by setting a value to the `ref` which is passed as a `v-model` to the `VueSelect` component.

::: tip
It is possible to pre-select multiple values when using the `isMulti` prop.
:::

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";

const options = [
  { label: 'Option #1', value: 'option_1' },
  { label: 'Option #2', value: 'option_2' },
  { label: 'Option #3', value: 'option_3' },
  { label: 'Option #4', value: 'option_4' },
  { label: 'Option #5', value: 'option_5' },
];

const singleSelected = ref("option_1");
const multiSelected = ref(["option_3", "option_5"]);
</script>

<p>Single select:</p>

<VueSelect
  v-model="singleSelected"
  :options="options"
/>

<p>Multi select:</p>

<VueSelect
  v-model="multiSelected"
  :options="options"
  :is-multi="true"
/>

## Demo source-code

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";

const options = [
  { label: "Option #1", value: "option_1" },
  { label: "Option #2", value: "option_2" },
  { label: "Option #3", value: "option_3" },
  { label: "Option #4", value: "option_4" },
  { label: "Option #5", value: "option_5" },
];

const singleSelected = ref("option_1");
const multiSelected = ref(["option_3", "option_5"]);
</script>

<template>
  <p>Single select:</p>

  <VueSelect
    v-model="singleSelected"
    :options="options"
  />

  <p>Multi select:</p>

  <VueSelect
    v-model="multiSelected"
    :options="options"
    :is-multi="true"
  />
</template>
```
