---
title: 'Multiple Select'
---

# Multiple Select

The following example demonstrates how to use the `VueSelect` component to create a multiple select dropdown.

::: warning
Setting `is-multi` to `true` will change the `v-model` to become an array of any `any[]`. Make sure to update your `v-model` accordingly.
:::

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";

const selected = ref([]);
</script>

<ClientOnly>
  <VueSelect
    v-model="selected"
    :is-multi="true"
    :options="[
      { label: 'Option #1', value: 'option_1' },
      { label: 'Option #2', value: 'option_2' },
      { label: 'Option #3', value: 'option_3' },
    ]"
  />
</ClientOnly>

Selected value(s): **{{ selected.length ? selected.join(", ") : "none" }}**

## Demo source-code

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";
import "vue3-select-component/styles";

// When setting `is-multi` to `true`, the `v-model` should be an array of strings.
const selected = ref<string[]>([]);
</script>

<template>
  <VueSelect
    v-model="selected"
    :is-multi="true"
    :options="[
      { label: 'Option #1', value: 'option_1' },
      { label: 'Option #2', value: 'option_2' },
      { label: 'Option #3', value: 'option_3' },
    ]"
  />
</template>
```
