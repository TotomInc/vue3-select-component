<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectValueProps } from "@v1/types/primitives";

import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

import SelectTag from "./SelectTag.vue";

defineProps<SelectValueProps>();

const context = injectSelectContext<OptionValue>();

const isMultiple = computed(() => context.multiple.value);
const selectedOptions = computed(() => context.selectedOptions.value);
</script>

<template>
  <span data-v1-select-value>
    <slot :selected-options="selectedOptions">
      <template v-if="isMultiple">
        <SelectTag
          v-for="option in selectedOptions"
          :key="String(option.value)"
          :value="option.value"
          :label="option.label"
        />
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
