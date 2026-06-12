<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectOptionProps } from "@/types/primitives";
import type { SelectOptionSlots } from "@/types/slots";

import { computed, onMounted, onUnmounted } from "vue";
import { injectSelectContext } from "@/lib/context";
import { injectOptionalSelectGroupContext } from "@/lib/group-context";
import { createOptionId } from "@/lib/ids";

const props = defineProps<SelectOptionProps<OptionValue>>();

defineSlots<SelectOptionSlots>();

const context = injectSelectContext<OptionValue>();
const groupContext = injectOptionalSelectGroupContext<OptionValue>();
const optionId = createOptionId();

const isSelected = computed(() => {
  const { modelValue, multiple } = context;

  if (multiple.value) {
    const values = Array.isArray(modelValue.value) ? modelValue.value : [];
    return values.includes(props.value);
  }

  return modelValue.value === props.value;
});

const isActive = computed(() => context.activeOptionValue.value === props.value);

const isVisible = computed(() => context.isOptionVisible(props.value));

const showCheckmark = computed(() => context.multiple.value && isSelected.value);

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
  groupContext?.registerOptionValue(props.value);
});

onUnmounted(() => {
  context.unregisterOption(optionId);
  groupContext?.unregisterOptionValue(props.value);
});
</script>

<template>
  <div
    v-if="isVisible"
    :id="optionId"
    role="option"
    data-select-option
    :data-value="String(value)"
    :data-active="isActive"
    :aria-selected="isSelected"
    :aria-disabled="disabled"
    @click="onOptionClick"
  >
    <span data-select-option-label>
      <slot>{{ label }}</slot>
    </span>
    <span
      v-if="showCheckmark"
      data-select-option-checkmark
      aria-hidden="true"
    >
      <slot name="checkmark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          width="1em"
          height="1em"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </slot>
    </span>
  </div>
</template>
