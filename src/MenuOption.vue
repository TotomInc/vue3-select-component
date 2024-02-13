<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

const props = defineProps<{
  isFocused: boolean;
  isSelected: boolean;
}>();

const emit = defineEmits<{
  (e: "select"): void;
}>();

const option = ref<HTMLButtonElement | null>(null);

// Scroll the focused option into view when it's out of the menu's viewport.
watch(
  () => props.isFocused,
  async () => {
    if (props.isFocused) {
      // Use nextTick to wait for the next DOM render.
      await nextTick(() => {
        option.value?.parentElement?.scrollTo({
          top: option.value?.offsetTop - option.value?.parentElement?.offsetHeight + option.value?.offsetHeight,
          behavior: "instant",
        });
      });
    }
  },
);
</script>

<template>
  <div
    ref="option"
    tabindex="-1"
    role="option"
    :class="{ focused: isFocused, selected: isSelected }"
    :aria-disabled="false"
    @click="emit('select')"
  >
    <slot />
  </div>
</template>
