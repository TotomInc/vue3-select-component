---
title: 'Disabled Options'
---

# Disabled Options

The following example demonstrates how to use the `VueSelect` component with disabled options.

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";

const selected = ref("");
</script>

<VueSelect
  v-model="selected"
  :options="[
    { label: 'Option #1', value: 'option_1' },
    { label: 'Option #2', value: 'option_2', disabled: true },
    { label: 'Option #3', value: 'option_3' },
    { label: 'Option #4', value: 'option_4' },
    { label: 'Option #5', value: 'option_5', disabled: true },
    { label: 'Option #6', value: 'option_6' },
  ]"
/>

## Demo source-code

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";

const selected = ref("");
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="[
      { label: 'Option #1', value: 'option_1' },
      { label: 'Option #2', value: 'option_2', disabled: true },
      { label: 'Option #3', value: 'option_3' },
      { label: 'Option #4', value: 'option_4' },
      { label: 'Option #5', value: 'option_5', disabled: true },
      { label: 'Option #6', value: 'option_6' },
    ]"
  />
</template>
```
