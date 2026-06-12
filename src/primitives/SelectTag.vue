<script setup lang="ts" generic="OptionValue extends string | number = string">
import { injectSelectContext } from "@/lib/context";

const props = defineProps<{
  value: OptionValue;
  label: string;
}>();

const context = injectSelectContext<OptionValue>();

function onRemoveClick(event: MouseEvent) {
  event.stopPropagation();
  context.deselect(props.value);
}
</script>

<template>
  <span data-select-tag>
    <slot :label="label" :value="value">
      {{ label }}
    </slot>
    <button
      type="button"
      data-select-tag-remove
      aria-label="Remove"
      @click="onRemoveClick"
    >
      <slot
        name="remove"
        :label="label"
        :value="value"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          width="1em"
          height="1em"
          aria-hidden="true"
        >
          <path
            d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      </slot>
    </button>
  </span>
</template>
