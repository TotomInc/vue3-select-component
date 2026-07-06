<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectOptionProps } from "@/types/primitives";
import type { SelectOptionSlots } from "@/types/slots";

import { computed, onMounted, onUnmounted, watch } from "vue";
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

// Read disabled from the merged collection so behavior stays correct when props are
// stale (e.g. useVirtualList snapshots item.data). Falls back to the prop for
// declarative-only usage without an options prop.
const resolvedOption = computed(() =>
  context.allOptions.value.find((option) => option.value === props.value),
);

const isDisabled = computed(() =>
  resolvedOption.value?.disabled ?? props.disabled ?? false,
);

function onOptionClick() {
  if (isDisabled.value) {
    return;
  }

  context.select(props.value);
}

function registerCurrentOption() {
  context.registerOption({
    id: optionId,
    value: props.value,
    label: props.label,
    disabled: props.disabled ?? false,
  });
}

onMounted(() => {
  registerCurrentOption();
  groupContext?.registerOptionValue(props.value);
});

// Keep the declarative registry in sync when props change. Needed for
// declarative-only selects. When an options prop is also passed, allOptions
// already prefers prop metadata on merge.
watch(
  () => [props.label, props.disabled] as const,
  () => {
    registerCurrentOption();
  },
);

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
    :aria-disabled="isDisabled"
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
