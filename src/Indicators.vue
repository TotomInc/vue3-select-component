<script setup lang="ts" generic="GenericOption extends Option<OptionValue>, OptionValue = string">
import type { Option } from "@/types/option";
import type { IndicatorsSlots } from "@/types/slots";
import ChevronDownIcon from "@/icons/ChevronDownIcon.vue";
import XMarkIcon from "@/icons/XMarkIcon.vue";
import Spinner from "@/Spinner.vue";

import { useTemplateRef } from "vue";

const props = defineProps<{
  hasSelectedOption: boolean;
  isMenuOpen: boolean;
  isClearable: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  slots: IndicatorsSlots<GenericOption, OptionValue>;
}>();

const emit = defineEmits<{
  (e: "clear"): void;
  (e: "toggle"): void;
}>();

const containerRef = useTemplateRef("container");
const clearButtonRef = useTemplateRef("clearButton");
const dropdownButtonRef = useTemplateRef("dropdownButton");

defineExpose({ containerRef, clearButtonRef, dropdownButtonRef });
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
      <template v-if="props.slots.clear">
        <component :is="props.slots.clear" />
      </template>

      <template v-else>
        <XMarkIcon />
      </template>
    </button>

    <button
      v-if="!isLoading"
      ref="dropdownButton"
      type="button"
      class="dropdown-icon"
      :class="{ active: isMenuOpen }"
      tabindex="-1"
      :disabled="isDisabled"
      @click.stop="emit('toggle')"
    >
      <template v-if="props.slots.dropdown">
        <component :is="props.slots.dropdown" />
      </template>

      <template v-else>
        <ChevronDownIcon />
      </template>
    </button>

    <template v-if="props.slots.loading">
      <component :is="props.slots.loading" />
    </template>

    <template v-else>
      <Spinner v-if="isLoading" />
    </template>
  </div>
</template>

<style lang="css" scoped>
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
  width: var(--vs-indicator-icon-size);
  height: var(--vs-indicator-icon-size);
  color: var(--vs-indicator-icon-color);
  background: none;
  outline: none;
  cursor: var(--vs-indicator-icon-cursor);
}

.dropdown-icon {
  appearance: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  border: 0;
  width: var(--vs-indicator-icon-size);
  height: var(--vs-indicator-icon-size);
  color: var(--vs-indicator-icon-color);
  background: none;
  outline: none;
  cursor: var(--vs-indicator-icon-cursor);
  transition: var(--vs-indicator-dropdown-icon-transition);
}

.dropdown-icon.active {
  transform: rotate(180deg);
}
</style>
