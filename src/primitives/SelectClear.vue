<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

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
    <slot />
  </button>
</template>
