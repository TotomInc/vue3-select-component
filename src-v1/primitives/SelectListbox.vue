<script setup lang="ts">
import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

const context = injectSelectContext();

const isMultiple = computed(() => context.multiple.value);

function onListboxKeydown(event: KeyboardEvent) {
  context.handleKeydown(event);
}
</script>

<template>
  <div
    :id="context.listboxId"
    role="listbox"
    data-v1-select-listbox
    :aria-multiselectable="isMultiple"
    tabindex="-1"
    @keydown="onListboxKeydown"
  >
    <slot />
  </div>
</template>
