<script setup lang="ts">
import type { SelectClearSlots } from "@/types/slots";

import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

defineSlots<SelectClearSlots>();

const context = injectSelectContext();

const hasValue = computed(() => {
  const { modelValue, multiple } = context;

  if (multiple.value) {
    return Array.isArray(modelValue.value) && modelValue.value.length > 0;
  }

  return modelValue.value != null;
});

const isVisible = computed(() => context.clearable.value && hasValue.value && !context.disabled.value);

function onClearClick(event: MouseEvent) {
  event.stopPropagation();
  context.clear();
}
</script>

<template>
  <button
    v-if="isVisible"
    type="button"
    data-select-clear
    aria-label="Clear selection"
    @click="onClearClick"
  >
    <slot>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        width="1em"
        height="1em"
        aria-hidden="true"
      >
        <path
          d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z"
        />
      </svg>
    </slot>
  </button>
</template>
