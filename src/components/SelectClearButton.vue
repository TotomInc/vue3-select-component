<script setup lang="ts">
import XMarkIcon from "@/icons/XMarkIcon.vue";

defineProps<{
  disabled?: boolean;
}>();

defineEmits<{
  (e: "clear"): void;
}>();
</script>

<template>
  <button
    type="button"
    class="clear-button"
    tabindex="-1"
    :disabled="disabled"
    @click="$emit('clear')"
  >
    <slot>
      <XMarkIcon />
    </slot>
  </button>
</template>

<style scoped>
.clear-button {
  appearance: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  border: 0;
  width: var(--vs-icon-size);
  height: var(--vs-icon-size);
  color: var(--vs-icon-color);
  background: none;
  outline: none;
  cursor: pointer;
}
</style>
