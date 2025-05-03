<script setup lang="ts" generic="GenericOption extends Option<OptionValue>, OptionValue = string">
import type { DataInjection, PropsInjection } from "@/lib/provide-inject";
import type { Option } from "@/types/option";
import { DATA_KEY, PROPS_KEY } from "@/lib/provide-inject";
import MenuOption from "@/MenuOption.vue";

import { inject, onBeforeUnmount, onMounted, useTemplateRef } from "vue";

const props = inject<PropsInjection<GenericOption, OptionValue>>(PROPS_KEY)!;
const data = inject<DataInjection<GenericOption, OptionValue>>(DATA_KEY)!;

const menuRef = useTemplateRef("menu");

const calculateMenuPosition = () => {
  if (data.containerRef.value) {
    const rect = data.containerRef.value.getBoundingClientRect();

    return {
      left: `${rect.x}px`,
      top: `${rect.y + rect.height}px`,
    };
  }

  console.warn("Unable to calculate dynamic menu position because of missing internal DOM reference.");

  return { top: "0px", left: "0px" };
};

const handleNavigation = (e: KeyboardEvent) => {
  if (data.menuOpen.value) {
    const currentIndex = data.focusedOption.value;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      const nextOptionIndex = data.availableOptions.value.findIndex((option, i) => !option.disabled && i > currentIndex);
      const firstOptionIndex = data.availableOptions.value.findIndex((option) => !option.disabled);

      data.focusedOption.value = nextOptionIndex === -1 ? firstOptionIndex : nextOptionIndex;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      const prevOptionIndex = data.availableOptions.value.reduce(
        (acc, option, i) => (!option.disabled && i < currentIndex ? i : acc),
        -1,
      );

      const lastOptionIndex = data.availableOptions.value.reduce(
        (acc, option, i) => (!option.disabled ? i : acc),
        -1,
      );

      data.focusedOption.value = prevOptionIndex === -1 ? lastOptionIndex : prevOptionIndex;
    }

    if (e.key === "Enter") {
      const selectedOption = data.availableOptions.value[currentIndex];

      e.preventDefault();

      if (selectedOption) {
        data.setOption(selectedOption);
      }
      else if (props.isTaggable && data.search.value) {
        data.createOption();
      }
    }

    // When pressing space with menu open but no search, select the focused option.
    if (e.code === "Space" && data.search.value.length === 0) {
      const selectedOption = data.availableOptions.value[currentIndex];

      e.preventDefault();

      if (selectedOption) {
        data.setOption(selectedOption);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      data.closeMenu();
    }

    const hasSelectedValue = props.isMulti && Array.isArray(data.vmodel.value) ? data.vmodel.value.length > 0 : !!data.vmodel.value;

    // When pressing backspace with no search, remove the last selected option.
    if (e.key === "Backspace" && data.search.value.length === 0 && hasSelectedValue) {
      e.preventDefault();

      if (props.isMulti && Array.isArray(data.vmodel.value)) {
        data.vmodel.value = data.vmodel.value.slice(0, -1);
      }
      else {
        data.vmodel.value = undefined as OptionValue;
      }
    }
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  const isInsideContainer = data.containerRef.value && data.containerRef.value.contains(target);
  const isInsideMenu = menuRef.value && menuRef.value.contains(target);

  if (!isInsideContainer && !isInsideMenu) {
    data.closeMenu();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleNavigation);
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleNavigation);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    :id="`vue-select-${props.uid}-listbox`"
    ref="menu"
    class="menu"
    :class="props.classes?.menuContainer"
    role="listbox"
    :aria-label="props.aria?.labelledby"
    :aria-multiselectable="props.isMulti"
    :style="{
      width: props.teleport ? `${data.containerRef?.value?.getBoundingClientRect().width}px` : '100%',
      top: props.teleport ? calculateMenuPosition().top : 'unset',
      left: props.teleport ? calculateMenuPosition().left : 'unset',
    }"
  >
    <MenuOption
      v-for="(option, i) in data.availableOptions.value"
      :key="i"
      type="button"
      :menu="menuRef"
      :index="i"
      :is-focused="data.focusedOption.value === i"
      :is-selected="Array.isArray(data.vmodel.value) ? data.vmodel.value.includes(option.value) : option.value === data.vmodel.value"
      :is-disabled="option.disabled || false"
      :class="props.classes?.menuOption"
      @select="data.setOption(option)"
    >
      <slot name="menu-header" />

      <slot
        name="option"
        :option="option"
        :index="i"
        :is-focused="data.focusedOption.value === i"
        :is-selected="Array.isArray(data.vmodel.value) ? data.vmodel.value.includes(option.value) : option.value === data.vmodel.value"
        :is-disabled="option.disabled || false"
      >
        {{ props.getOptionLabel ? props.getOptionLabel(option) : option.label }}
      </slot>
    </MenuOption>

    <div
      v-if="!props.isTaggable && data.availableOptions.value.length === 0"
      class="no-results"
      :class="props.classes?.noResults"
    >
      <slot name="no-options">
        No results found
      </slot>
    </div>

    <div
      v-if="props.isTaggable && data.search.value"
      class="taggable-no-options"
      :class="props.classes?.taggableNoOptions"
      @click="data.createOption"
    >
      <slot
        name="taggable-no-options"
        :option="data.search.value"
      >
        Press enter to add {{ data.search.value }} option
      </slot>
    </div>
  </div>
</template>

<style lang="css" scoped>
* {
  box-sizing: border-box;
}

.menu {
  position: absolute;
  margin-top: var(--vs-menu-offset-top);
  max-height: var(--vs-menu-height);
  overflow-y: auto;
  border: var(--vs-menu-border);
  border-radius: var(--vs-border-radius);
  box-shadow: var(--vs-menu-box-shadow);
  background-color: var(--vs-menu-background-color);
  z-index: var(--vs-menu-z-index);
}

.no-results {
  padding: var(--vs-option-padding);
  font-size: var(--vs-font-size);
  font-family: var(--vs-font-family);
  color: var(--vs-text-color);
}

.taggable-no-options {
  padding: var(--vs-option-padding);
  font-size: var(--vs-font-size);
  font-family: var(--vs-font-family);
  color: var(--vs-text-color);
  cursor: pointer;
}
</style>
