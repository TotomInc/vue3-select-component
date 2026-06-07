<script setup lang="ts" generic="OptionValue extends string | number = string">
import { injectSelectContext } from "@v1/lib/context";

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
  <span data-v1-select-tag>
    <slot :label="label" :value="value">
      {{ label }}
    </slot>
    <button
      type="button"
      data-v1-select-tag-remove
      aria-label="Remove"
      @click="onRemoveClick"
    >
      <slot name="remove" />
    </button>
  </span>
</template>
