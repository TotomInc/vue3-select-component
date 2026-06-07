<script setup lang="ts">
import type { SelectValueProps } from "@v1/types/primitives";

import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

defineProps<SelectValueProps>();

const context = injectSelectContext();

const displayValue = computed(() => {
  const { modelValue, multiple } = context;

  if (multiple.value) {
    const values = Array.isArray(modelValue.value) ? modelValue.value : [];
    return values.length > 0 ? String(values.length) : null;
  }

  return modelValue.value != null ? String(modelValue.value) : null;
});
</script>

<template>
  <span data-v1-select-value>
    <slot :value="displayValue">
      <template v-if="displayValue != null">
        {{ displayValue }}
      </template>
      <template v-else-if="placeholder">
        {{ placeholder }}
      </template>
    </slot>
  </span>
</template>
