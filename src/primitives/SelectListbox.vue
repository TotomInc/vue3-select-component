<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

const context = injectSelectContext();

const isMultiple = computed(() => context.multiple.value);
const labelledBy = computed(() => {
  if (context.searchable.value) {
    return context.inputElement.value?.id ?? context.inputId;
  }

  return context.triggerId;
});

function onListboxKeydown(event: KeyboardEvent) {
  context.handleKeydown(event);
}
</script>

<template>
  <div
    :id="context.listboxId"
    role="listbox"
    data-select-listbox
    :aria-labelledby="labelledBy"
    :aria-multiselectable="isMultiple"
    tabindex="-1"
    @keydown="onListboxKeydown"
  >
    <slot />
  </div>
</template>
