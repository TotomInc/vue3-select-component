---
title: 'Custom option slot'
---

# Custom option slot

The following example demonstrates how to use the `VueSelect` component with custom slots for `#value` & `#option` slots.

::: info
Read more about available [slots here](../slots.md).
:::

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";

const selected = ref("");
</script>

<ClientOnly>
  <VueSelect
    v-model="selected"
    :options="[
      { label: 'France', value: 'fr' },
      { label: 'USA', value: 'us' },
      { label: 'Germany', value: 'de' },
      { label: 'Italy', value: 'it' },
      { label: 'Spain', value: 'es' },
      { label: 'Colombia', value: 'co' },
      { label: 'Ecuador', value: 'ec' },
    ]"
  >
    <template #value="{ option }">
      <div :class="$style['custom-value']">
        <img :src="`https://flagsapi.com/${option.value.toUpperCase()}/flat/24.png`" class="block w-6 h-auto">
        <span>{{ option.label }}</span>
      </div>
    </template>

    <template #option="{ option }">
      <p :class="$style['custom-option']">
        {{ option.label }} <small>{{ option.value }}</small>
      </p>
    </template>
  </VueSelect>
</ClientOnly>

<style module>
.custom-value {
  display: flex;
  align-items: center;
  gap: 6px;
}

.custom-option {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #171717;
  font-weight: 500;
  font-size: 16px;
  /* Overrides because of VitePress. */
  margin: 0 !important;
  line-height: 21px !important;
}

.custom-option small {
  color: #525252;
  font-weight: 500;
  font-size: 14px;
}
</style>

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
      { label: 'France', value: 'fr' },
      { label: 'USA', value: 'us' },
      { label: 'Germany', value: 'de' },
      { label: 'Italy', value: 'it' },
      { label: 'Spain', value: 'es' },
      { label: 'Colombia', value: 'co' },
      { label: 'Ecuador', value: 'ec' },
    ]"
  >
    <template #value="{ option }">
      <div class="custom-value">
        <img :src="`https://flagsapi.com/${option.value.toUpperCase()}/flat/24.png`" class="block w-6 h-auto">
        <span>{{ option.label }}</span>
      </div>
    </template>

    <template #option="{ option }">
      <p class="custom-option">
        {{ option.label }} <small>{{ option.value }}</small>
      </p>
    </template>
  </VueSelect>
</template>

<style lang="css" scoped>
:deep(.vue-select .custom-value) {
  display: flex;
  align-items: center;
  gap: 6px;
}

:deep(.vue-select .custom-option) {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #171717;
  font-weight: 500;
  font-size: 16px;
}

:deep(.vue-select .custom-option small) {
  color: #525252;
  font-weight: 500;
  font-size: 14px;
}
</style>
```
