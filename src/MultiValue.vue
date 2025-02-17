<script setup lang="ts">
import XMarkIcon from "./icons/XMarkIcon.vue";

defineProps<{
  label: string;
}>();

const emit = defineEmits<{
  (e: "remove"): void;
}>();
</script>

<template>
  <div
    class="multi-value"
  >
    <div class="multi-value-label">
      {{ label }}
    </div>

    <button
      type="button"
      class="multi-value-remove"
      :aria-label="`Remove ${label}`"
      @click="emit('remove')"
    >
      <XMarkIcon />
    </button>
  </div>
</template>

<style lang="css" scoped>
.multi-value {
  display: flex;
  min-width: 0px;
  margin: 2px;
  border-radius: var(--vs-multi-value-border-radius);
  background: var(--vs-multi-value-bg);
}

.multi-value-label {
  border-radius: var(--vs-multi-value-border-radius);
  padding: 3px 3px 3px 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 85%;
  color: var(--vs-multi-value-text-color);
}

.multi-value-remove {
  border-radius: var(--vs-multi-value-border-radius);
  appearance: none;
  display: flex;
  align-items: center;
  padding: 0 4px;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: var(--vs-multi-value-bg);
}

.multi-value-remove svg {
  width: var(--vs-multi-value-xmark-size);
  height: var(--vs-multi-value-xmark-size);
  fill: var(--vs-multi-value-xmark-color);
}
</style>
