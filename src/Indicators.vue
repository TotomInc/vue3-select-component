<script setup lang="ts">
import { defineExpose, useTemplateRef } from "vue";

import ChevronDownIcon from "./icons/ChevronDownIcon.vue";
import XMarkIcon from "./icons/XMarkIcon.vue";
import Spinner from "./Spinner.vue";

defineProps<{
  hasSelectedOption: boolean;
  isClearable: boolean;
  isLoading: boolean;
  isDisabled: boolean;
}>();

const emit = defineEmits<{
  (e: "clear"): void;
  (e: "toggle"): void;
}>();

const container = useTemplateRef("container");
const clearButton = useTemplateRef("clearButton");
const dropdownButton = useTemplateRef("dropdownButton");

defineExpose({ container, clearButton, dropdownButton });
</script>

<template>
  <div ref="container" class="indicators-container">
    <button
      v-if="hasSelectedOption && isClearable && !isLoading"
      ref="clearButton"
      type="button"
      class="clear-button"
      tabindex="-1"
      :disabled="isDisabled"
      @click.stop="emit('clear')"
    >
      <slot name="clear">
        <XMarkIcon />
      </slot>
    </button>

    <button
      v-if="!isLoading"
      ref="dropdownButton"
      type="button"
      class="dropdown-icon"
      tabindex="-1"
      :disabled="isDisabled"
      @click.stop="emit('toggle')"
    >
      <slot name="dropdown">
        <ChevronDownIcon />
      </slot>
    </button>

    <slot name="loading">
      <Spinner v-if="isLoading" />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.indicators-container {
  display: flex;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  gap: var(--vs-indicators-gap);
  padding: var(--vs-padding);
}

.clear-button {
  appearance: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  border: 0;
  width: var(--vs-icon-size);
  height: var(--vs-icon-size);
  color: var(--vs-icon-color);
  background: none;
  outline: none;
  cursor: pointer;
}

.dropdown-icon {
  appearance: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  border: 0;
  width: var(--vs-icon-size);
  height: var(--vs-icon-size);
  color: var(--vs-icon-color);
  background: none;
  outline: none;
  cursor: pointer;
  transition: var(--vs-dropdown-transition);
}
</style>
