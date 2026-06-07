<script setup lang="ts">
import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

const context = injectSelectContext();

const isSearchable = computed(() => context.searchable.value);
const isDisabled = computed(() => context.disabled.value);
const searchValue = computed({
  get: () => context.searchValue.value,
  set: (value: string) => {
    context.searchValue.value = value;
  },
});

function onInputKeydown(event: KeyboardEvent) {
  context.handleKeydown(event);
}
</script>

<template>
  <input
    v-if="isSearchable"
    v-model="searchValue"
    type="text"
    data-v1-select-input
    autocomplete="off"
    :disabled="isDisabled"
    @keydown="onInputKeydown"
  >
</template>
