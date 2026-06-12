<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";
import { resolveHTMLElement } from "@/lib/dom";

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);
const isDisabled = computed(() => context.disabled.value);
const isSearchable = computed(() => context.searchable.value);
const triggerTag = computed(() => isSearchable.value ? "div" : "button");

function onTriggerClick() {
  if (isDisabled.value) {
    return;
  }

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
  <component
    :is="triggerTag"
    :id="context.triggerId"
    :ref="onTriggerElement"
    :type="isSearchable ? undefined : 'button'"
    data-select-trigger
    :aria-expanded="isSearchable ? undefined : isOpen"
    :aria-haspopup="isSearchable ? undefined : 'listbox'"
    :aria-controls="isSearchable ? undefined : context.listboxId"
    :disabled="isSearchable ? undefined : isDisabled"
    :aria-disabled="isSearchable ? isDisabled : undefined"
    @click="onTriggerClick"
    @keydown="onTriggerKeydown"
  >
    <slot />
  </component>
</template>
