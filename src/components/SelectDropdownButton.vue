<script setup lang="ts">
import ChevronDownIcon from "@/icons/ChevronDownIcon.vue";

defineProps<{
  disabled?: boolean;
}>();

defineEmits<{
  (e: "toggle"): void;
}>();
</script>

<template>
  <button
    type="button"
    class="dropdown-icon"
    tabindex="-1"
    :disabled="disabled"
    @click="$emit('toggle')"
  >
    <slot>
      <ChevronDownIcon />
    </slot>
  </button>
</template>

<style scoped>
.dropdown-icon {
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
  transition: var(--vs-dropdown-transition);
}
</style>
