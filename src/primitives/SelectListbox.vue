<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

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
    data-select-listbox
    :aria-multiselectable="isMultiple"
    tabindex="-1"
    @keydown="onListboxKeydown"
  >
    <slot />
  </div>
</template>
