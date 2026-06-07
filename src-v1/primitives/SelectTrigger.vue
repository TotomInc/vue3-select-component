<script setup lang="ts">
import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);
const isDisabled = computed(() => context.disabled.value);
const isSearchable = computed(() => context.searchable.value);

const ariaActivedescendant = computed(() => {
  if (!isOpen.value) {
    return undefined;
  }

  return context.activeOptionElementId.value;
});

function onTriggerClick() {
  context.toggle();
}

function onTriggerKeydown(event: KeyboardEvent) {
  context.handleKeydown(event);
}
</script>

<template>
  <button
    :id="context.triggerId"
    type="button"
    data-v1-select-trigger
    :aria-expanded="isOpen"
    aria-haspopup="listbox"
    :aria-controls="context.listboxId"
    :aria-activedescendant="ariaActivedescendant"
    :role="isSearchable ? 'combobox' : undefined"
    :disabled="isDisabled"
    @click="onTriggerClick"
    @keydown="onTriggerKeydown"
  >
    <slot />
  </button>
</template>
