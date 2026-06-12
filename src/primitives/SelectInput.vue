<script setup lang="ts">
import type { SelectInputProps } from "@/types/primitives";

import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";
import { resolveHTMLElement } from "@/lib/dom";

const props = defineProps<SelectInputProps>();

const context = injectSelectContext();

const isSearchable = computed(() => context.searchable.value);
const isDisabled = computed(() => context.disabled.value);
const isOpen = computed(() => context.isOpen.value);
const inputId = computed(() => props.id ?? context.inputId);
const ariaActivedescendant = computed(() => {
  if (!isOpen.value) {
    return undefined;
  }

  return context.activeOptionElementId.value;
});

const searchValue = computed({
  get: () => context.searchValue.value,
  set: (value: string) => {
    context.searchValue.value = value;
  },
});

function onInputElement(element: Parameters<typeof resolveHTMLElement>[0]) {
  const resolvedElement = resolveHTMLElement(element);

  context.registerInputElement(resolvedElement instanceof HTMLInputElement ? resolvedElement : null);
}

function onInputClick() {
  context.open();
}

function onInputFocus() {
  context.open();
}

function onInputKeydown(event: KeyboardEvent) {
  context.handleKeydown(event);
}
</script>

<template>
  <input
    v-if="isSearchable"
    :id="inputId"
    :ref="onInputElement"
    v-model="searchValue"
    type="text"
    data-select-input
    role="combobox"
    aria-autocomplete="list"
    aria-haspopup="listbox"
    :aria-expanded="isOpen"
    :aria-controls="context.listboxId"
    :aria-activedescendant="ariaActivedescendant"
    :placeholder="placeholder"
    autocomplete="off"
    :disabled="isDisabled"
    @click.stop="onInputClick"
    @focus="onInputFocus"
    @keydown.stop="onInputKeydown"
  >
</template>
