---
title: 'Dropdown menu header'
---

# Dropdown menu header

The following example demonstrates how to use the `VueSelect` component with a custom menu header before the options.

In this example, we can make the menu header sticky, so it will always be visible when scrolling through the options.

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";


const selected = ref("");
</script>

<ClientOnly>
  <VueSelect
    v-model="selected"
    :options="[
      { label: 'Option #1', value: 'option_1' },
      { label: 'Option #2', value: 'option_2' },
      { label: 'Option #3', value: 'option_3' },
      { label: 'Option #4', value: 'option_4' },
      { label: 'Option #5', value: 'option_5' },
    ]"
  >
    <template #menu-header>
      <div class="menu-header">
        <h3>Books</h3>
      </div>
    </template>
  </VueSelect>
</ClientOnly>

<style scoped>
.menu-header {
  position: sticky;
  top: 0;
  padding: 0.5rem 1rem;
  background-color: #f4f4f5;
}

.menu-header h3 {
  margin: 0;
  color: var(--vs-option-text-color);
}
</style>

## Demo source-code

```vue
<script setup>
import { ref } from "vue";
import VueSelect from "vue3-select-component";

const selected = ref("");
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="[
      { label: 'Option #1', value: 'option_1' },
      { label: 'Option #2', value: 'option_2' },
      { label: 'Option #3', value: 'option_3' },
      { label: 'Option #4', value: 'option_4' },
      { label: 'Option #5', value: 'option_5' },
    ]"
  >
    <template #menu-header>
      <div class="menu-header">
        <h3>Books</h3>
      </div>
    </template>
  </VueSelect>
</template>

<style scoped>
.menu-header {
  position: sticky;
  top: 0;
  padding: 0.5rem 1rem;
  background-color: #f4f4f5;
}

.menu-header h3 {
  margin: 0;
  color: var(--vs-option-text-color);
}
</style>
```
