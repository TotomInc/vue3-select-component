<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";
import { resolveHTMLElement } from "@/lib/dom";

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

function onTriggerElement(element: Parameters<typeof resolveHTMLElement>[0]) {
  context.registerTriggerElement(resolveHTMLElement(element));
}
</script>

<template>
  <button
    :id="context.triggerId"
    :ref="onTriggerElement"
    type="button"
    data-select-trigger
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
