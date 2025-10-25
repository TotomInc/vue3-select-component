<script setup lang="ts" generic="GenericOption">
import XMarkIcon from "./icons/XMarkIcon.vue";

const props = defineProps<{
  label: string;
  option: GenericOption;
  classes?: {
    multiValue?: string;
    multiValueLabel?: string;
    multiValueRemove?: string;
  };
  tagContentSlot?: (props: { option: GenericOption }) => any;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
}>();
</script>

<template>
  <div
    class="multi-value"
    :class="props.classes?.multiValue"
  >
    <div class="multi-value-label" :class="props.classes?.multiValueLabel">
      <template v-if="props.tagContentSlot">
        <component :is="props.tagContentSlot" :option="props.option" />
      </template>

      <template v-else>
        {{ props.label }}
      </template>
    </div>

    <button
      type="button"
      class="multi-value-remove"
      :class="props.classes?.multiValueRemove"
      :aria-label="`Remove ${props.label}`"
      @click.stop="emit('remove')"
    >
      <XMarkIcon />
    </button>
  </div>
</template>

<style lang="css" scoped>
.multi-value {
  display: flex;
  min-width: 0px;
  margin: var(--vs-multi-value-margin);
  border-radius: var(--vs-multi-value-border-radius);
  background: var(--vs-multi-value-background-color);
}

.multi-value-label {
  padding: var(--vs-multi-value-label-padding);
  border: var(--vs-multi-value-border);
  border-radius: var(--vs-multi-value-border-radius);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vs-multi-value-label-font-size);
  font-weight: var(--vs-multi-value-label-font-weight);
  line-height: var(--vs-multi-value-label-line-height);
  color: var(--vs-multi-value-label-text-color);
}

.multi-value-remove {
  border-radius: var(--vs-multi-value-border-radius);
  appearance: none;
  display: flex;
  align-items: center;
  padding: var(--vs-multi-value-delete-padding);
  border: none;
  outline: none;
  cursor: var(--vs-multi-value-xmark-cursor);
  background-color: var(--vs-multi-value-background-color);
}

.multi-value-remove:hover {
  background-color: var(--vs-multi-value-delete-hover-background-color);
}

.multi-value-remove svg {
  width: var(--vs-multi-value-xmark-size);
  height: var(--vs-multi-value-xmark-size);
  fill: var(--vs-multi-value-xmark-color);
}

.multi-value-remove:hover svg {
  fill: var(--vs-multi-value-xmark-hover-color);
}
</style>
