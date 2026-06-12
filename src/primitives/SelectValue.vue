<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectValueProps } from "@/types/primitives";

import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

import SelectTag from "./SelectTag.vue";

defineProps<SelectValueProps>();

const context = injectSelectContext<OptionValue>();

const isMultiple = computed(() => context.multiple.value);
const selectedOptions = computed(() => context.selectedOptions.value);
const isEmpty = computed(() => selectedOptions.value.length === 0);
const isSearching = computed(() =>
  context.searchable.value
  && context.searchValue.value.length > 0,
);
</script>

<template>
  <span
    data-select-value
    :data-empty="isEmpty"
    :data-searching="isSearching"
  >
    <slot
      v-if="!isSearching"
      :selected-options="selectedOptions"
    >
      <template v-if="isMultiple">
        <SelectTag
          v-for="option in selectedOptions"
          :key="String(option.value)"
          :value="option.value"
          :label="option.label"
        >
          <template v-if="$slots['tag-remove']" #remove="tagRemoveSlotProps">
            <slot name="tag-remove" v-bind="tagRemoveSlotProps" />
          </template>
        </SelectTag>
        <template v-if="selectedOptions.length === 0 && placeholder">
          {{ placeholder }}
        </template>
      </template>
      <template v-else>
        <template v-if="selectedOptions[0]">
          {{ selectedOptions[0].label }}
        </template>
        <template v-else-if="placeholder">
          {{ placeholder }}
        </template>
      </template>
    </slot>
  </span>
</template>
