<script setup lang="ts">
import { inject, ref, watch } from "vue";
import { DATA_KEY } from "./lib/provide-inject";

const props = defineProps<{
  menu: HTMLDivElement | null;
  index: number;
  isFocused: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}>();

const emit = defineEmits<{
  (e: "select"): void;
}>();

const sharedData = inject(DATA_KEY);

const handleMouseEnter = () => {
  if (!props.isDisabled && sharedData?.setFocusedOption) {
    sharedData.setFocusedOption(props.index);
  }
};

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
    class="menu-option"
    :class="{ focused: isFocused, selected: isSelected, disabled: isDisabled }"
    role="option"
    :aria-disabled="isDisabled"
    :aria-selected="isSelected"
    @click="emit('select')"
    @keydown.enter="emit('select')"
    @mouseenter="handleMouseEnter"
  >
    <slot />
  </div>
</template>

<style lang="css" scoped>
* {
  box-sizing: border-box;
}

.menu-option {
  display: flex;
  width: var(--vs-option-width);
  border: 0;
  margin: 0;
  padding: var(--vs-option-padding);
  font-size: var(--vs-option-font-size);
  font-weight: var(--vs-option-font-weight);
  font-family: var(--vs-font-family);
  color: var(--vs-option-text-color);
  white-space: break-spaces;
  background-color: var(--vs-option-background-color);
  text-align: var(--vs-option-text-align);
  cursor: var(--vs-option-cursor);
}

.menu-option.focused:not(.selected):not(.disabled) {
  background-color: var(--vs-option-focused-background-color);
  color: var(--vs-option-focused-text-color);
}

.menu-option.selected {
  background-color: var(--vs-option-selected-background-color);
  color: var(--vs-option-selected-text-color);
}

.menu-option.disabled {
  background-color: var(--vs-option-disabled-background-color);
  color: var(--vs-option-disabled-text-color);
}
</style>
