<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectOptionProps } from "@v1/types/primitives";

import { injectSelectContext } from "@v1/lib/context";
import { createOptionId } from "@v1/lib/ids";
import { computed, onMounted, onUnmounted } from "vue";

const props = defineProps<SelectOptionProps<OptionValue>>();

const context = injectSelectContext<OptionValue>();
const optionId = createOptionId();

const isSelected = computed(() => {
  const { modelValue, multiple } = context;

  if (multiple.value) {
    const values = Array.isArray(modelValue.value) ? modelValue.value : [];
    return values.includes(props.value);
  }

  return modelValue.value === props.value;
});

function onOptionClick() {
  if (props.disabled) {
    return;
  }

  context.select(props.value);
}

onMounted(() => {
  context.registerOption({
    id: optionId,
    value: props.value,
    label: props.label,
    disabled: props.disabled ?? false,
  });
});

onUnmounted(() => {
  context.unregisterOption(optionId);
});
</script>

<template>
  <div
    role="option"
    data-v1-select-option
    :data-value="String(value)"
    :aria-selected="isSelected"
    :aria-disabled="disabled"
    @click="onOptionClick"
  >
    <slot>{{ label }}</slot>
  </div>
</template>
