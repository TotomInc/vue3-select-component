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
      <slot name="remove" />
    </button>
  </span>
</template>
