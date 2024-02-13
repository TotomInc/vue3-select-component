<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  menu: HTMLDivElement | null;
  index: number;
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
  () => {
    if (props.isFocused && props.menu) {
      // Get child element with index
      const option = props.menu.children[props.index] as HTMLDivElement;

      const optionTop = option.offsetTop;
      const optionBottom = optionTop + option.clientHeight;
      const menuScrollTop = props.menu.scrollTop;
      const menuHeight = props.menu.clientHeight;

      if (optionTop < menuScrollTop) {
        // eslint-disable-next-line vue/no-mutating-props
        props.menu.scrollTop = optionTop;
      }
      else if (optionBottom > menuScrollTop + menuHeight) {
        // eslint-disable-next-line vue/no-mutating-props
        props.menu.scrollTop = optionBottom - menuHeight;
      }
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
