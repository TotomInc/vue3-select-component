---
title: 'Controlled menu'
---

# Controlled menu

Control the menu open state programmatically with the `isMenuOpen` prop.

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";

const selected = ref("");
const isMenuOpen = ref(false);
</script>

<button type="button" @click="isMenuOpen = !isMenuOpen">
  Toggle menu ({{ isMenuOpen ? "opened" : "closed" }})
</button>

<ClientOnly>
  <VueSelect
    v-model="selected"
    :options="[
      { label: 'Option #1', value: 'option_1' },
      { label: 'Option #2', value: 'option_2' },
      { label: 'Option #3', value: 'option_3' },
    ]"
    :is-menu-open="isMenuOpen"
    @menu-opened="isMenuOpen = true"
    @menu-closed="isMenuOpen = false"
  />
</ClientOnly>

## Demo source-code

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";

const selected = ref("");
const isMenuOpen = ref(false);
</script>

<template>
  <button type="button" @click="isMenuOpen = !isMenuOpen">
    Toggle menu ({{ isMenuOpen ? "opened" : "closed" }})
  </button>

  <VueSelect
    v-model="selected"
    :options="[
      { label: 'Option #1', value: 'option_1' },
      { label: 'Option #2', value: 'option_2' },
      { label: 'Option #3', value: 'option_3' },
    ]"
    :is-menu-open="isMenuOpen"
    @menu-opened="isMenuOpen = true"
    @menu-closed="isMenuOpen = false"
  />
</template>
```
