<script setup lang="ts" generic="GenericOption extends Option<OptionValue>, OptionValue = string">
import type { DataInjection, PropsInjection } from "./lib/provide-inject";
import type { Option } from "./types/option";
import type { MenuSlots } from "./types/slots";
import { inject, onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import { DATA_KEY, PROPS_KEY } from "./lib/provide-inject";

import MenuOption from "./MenuOption.vue";

const props = defineProps<{
  slots: MenuSlots<GenericOption, OptionValue>;
}>();

const selected = defineModel<OptionValue | OptionValue[]>({ required: true });

const sharedProps = inject<PropsInjection<GenericOption, OptionValue>>(PROPS_KEY)!;
const sharedData = inject<DataInjection<GenericOption, OptionValue>>(DATA_KEY)!;

const menuRef = useTemplateRef("menu");

const calculateMenuPosition = () => {
  if (sharedData.containerRef.value) {
    const rect = sharedData.containerRef.value.getBoundingClientRect();

    return {
      left: `${rect.x}px`,
      top: `${rect.y + rect.height}px`,
    };
  }

  console.warn("Unable to calculate dynamic menu position because of missing internal DOM reference.");

  return { top: "0px", left: "0px" };
};

const handleNavigation = (e: KeyboardEvent) => {
  if (sharedData.menuOpen.value) {
    const currentIndex = sharedData.focusedOption.value;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      const nextOptionIndex = sharedData.availableOptions.value.findIndex((option, i) => !option.disabled && i > currentIndex);
      const firstOptionIndex = sharedData.availableOptions.value.findIndex((option) => !option.disabled);

      sharedData.focusedOption.value = nextOptionIndex === -1 ? firstOptionIndex : nextOptionIndex;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      const prevOptionIndex = sharedData.availableOptions.value.reduce(
        (acc, option, i) => (!option.disabled && i < currentIndex ? i : acc),
        -1,
      );

      const lastOptionIndex = sharedData.availableOptions.value.reduce(
        (acc, option, i) => (!option.disabled ? i : acc),
        -1,
      );

      sharedData.focusedOption.value = prevOptionIndex === -1 ? lastOptionIndex : prevOptionIndex;
    }

    if (e.key === "Enter") {
      const selectedOption = sharedData.availableOptions.value[currentIndex];

      e.preventDefault();

      if (selectedOption) {
        sharedData.setOption(selectedOption);
      }
      else if (sharedProps.isTaggable && sharedData.search.value) {
        sharedData.createOption();
      }
    }

    // When pressing space with menu open but no search, select the focused option.
    if (e.code === "Space" && sharedData.search.value.length === 0) {
      const selectedOption = sharedData.availableOptions.value[currentIndex];

      e.preventDefault();

      if (selectedOption) {
        sharedData.setOption(selectedOption);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      sharedData.closeMenu();
    }

    const hasSelectedValue = sharedProps.isMulti && Array.isArray(selected.value) ? selected.value.length > 0 : !!selected.value;

    // When pressing backspace with no search, remove the last selected option.
    if (e.key === "Backspace" && sharedData.search.value.length === 0 && hasSelectedValue) {
      e.preventDefault();

      if (sharedProps.isMulti && Array.isArray(selected.value)) {
        selected.value = selected.value.slice(0, -1);
      }
      else {
        selected.value = undefined as OptionValue;
      }
    }
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  const isInsideContainer = sharedData.containerRef.value && sharedData.containerRef.value.contains(target);
  const isInsideMenu = menuRef.value && menuRef.value.contains(target);

  if (!isInsideContainer && !isInsideMenu) {
    sharedData.closeMenu();
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
    :id="`vue-select-${sharedProps.uid}-listbox`"
    ref="menu"
    class="menu"
    :class="sharedProps.classes?.menuContainer"
    role="listbox"
    :aria-label="sharedProps.aria?.labelledby"
    :aria-multiselectable="sharedProps.isMulti"
    :style="{
      width: sharedProps.teleport ? `${sharedData.containerRef?.value?.getBoundingClientRect().width}px` : '100%',
      top: sharedProps.teleport ? calculateMenuPosition().top : 'unset',
      left: sharedProps.teleport ? calculateMenuPosition().left : 'unset',
    }"
  >
    <component :is="props.slots['menu-header']" v-if="props.slots['menu-header']" />

    <MenuOption
      v-for="(option, i) in sharedData.availableOptions.value"
      :key="i"
      type="button"
      :menu="menuRef"
      :index="i"
      :is-focused="sharedData.focusedOption.value === i"
      :is-selected="Array.isArray(selected) ? selected.includes(option.value) : option.value === selected"
      :is-disabled="option.disabled || false"
      :class="sharedProps.classes?.menuOption"
      @select="sharedData.setOption(option)"
    >
      <template v-if="props.slots.option">
        <component
          :is="props.slots.option"
          :option="option"
          :index="i"
          :is-focused="sharedData.focusedOption.value === i"
          :is-selected="Array.isArray(selected) ? selected.includes(option.value) : option.value === selected"
          :is-disabled="option.disabled || false"
        />
      </template>

      <template v-else-if="sharedProps.getOptionLabel">
        {{ sharedProps.getOptionLabel(option) }}
      </template>

      <template v-else>
        {{ option.label }}
      </template>
    </MenuOption>

    <div
      v-if="!sharedProps.isTaggable && sharedData.availableOptions.value.length === 0"
      class="no-results"
      :class="sharedProps.classes?.noResults"
    >
      <template v-if="props.slots['no-options']">
        <component :is="props.slots['no-options']" />
      </template>

      <template v-else>
        No results found
      </template>
    </div>

    <div
      v-if="sharedProps.isTaggable && sharedData.search.value"
      class="taggable-no-options"
      :class="sharedProps.classes?.taggableNoOptions"
      @click="sharedData.createOption"
    >
      <template v-if="props.slots['taggable-no-options']">
        <component :is="props.slots['taggable-no-options']" :option="sharedData.search.value" />
      </template>

      <template v-else>
        Press enter to add {{ sharedData.search.value }} option
      </template>
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
