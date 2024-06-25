<script setup lang="ts" generic="GenericOption extends Option<OptionValue>, OptionValue = string">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import type { Option } from "./types";
import ChevronDownIcon from "./icons/ChevronDownIcon.vue";
import XMarkIcon from "./icons/XMarkIcon.vue";
import MenuOption from "./MenuOption.vue";

const props = withDefaults(
  defineProps<{
    options: GenericOption[];
    /**
     * The placeholder text to display when no option is selected.
     */
    placeholder?: string;
    /**
     * When set to true, the input can be cleared by clicking the clear button.
     */
    isClearable?: boolean;
    /**
     * When set to true, disable the select component.
     */
    isDisabled?: boolean;
    /**
     * When set to true, allow the user to filter the options by typing in the search input.
     */
    isSearchable?: boolean;
    /**
     * When set to true, allow the user to select multiple options. This will change the
     * `selected` model to an array of strings. You should pass an array of strings to the
     * `v-model` directive when using this prop.
     */
    isMulti?: boolean;
    /**
     * When set to true, clear the search input when an option is selected.
     */
    closeOnSelect?: boolean;
    /**
     * Teleport the menu to another part of the DOM with higher priority such as `body`.
     * This way, you can avoid z-index issues. Menu position will be calculated using
     * JavaScript, instead of using CSS absolute & relative positioning.
     */
    teleport?: string;
    /**
     * The ID of the input element. This is useful for accessibility or forms.
     */
    inputId?: string;
    /**
     * ARIA attributes to describe the select component. This is useful for accessibility.
     */
    aria?: {
      labelledby?: string;
      required?: boolean;
    };
    /**
     * Callback to filter the options based on the search input. By default, it filters
     * the options based on the `label` property of the option. The label is retrieved using:
     *
     * - `getOptionLabel` when `isMulti` is `false`.
     * - `getMultiValueLabel` when `isMulti` is `true`.
     *
     * @param option The option to filter.
     * @param label The label of the option.
     * @param search The search input value.
     */
    filterBy?: (option: GenericOption, label: string, search: string) => boolean;
    /**
     * A function to get the label of an option. By default, it assumes the option is an
     * object with a `label` property. Used to display the selected option in the input &
     * inside the options menu.
     *
     * @param option The option to render.
     */
    getOptionLabel?: (option: GenericOption) => string;
    /**
     * A function to get the label of a multi-value option. By default, it assumes the
     * option is an object with a `label` property. Used only in the multi-value tag.
     *
     * @param option The option to render.
     */
    getMultiValueLabel?: (option: GenericOption) => string;
  }>(),
  {
    placeholder: "Select an option",
    isClearable: true,
    isDisabled: false,
    isSearchable: true,
    isMulti: false,
    closeOnSelect: true,
    teleport: undefined,
    inputId: undefined,
    aria: undefined,
    filterBy: (option: GenericOption, label: string, search: string) => label.toLowerCase().includes(search.toLowerCase()),
    getOptionLabel: (option: GenericOption) => option.label,
    getMultiValueLabel: (option: GenericOption) => option.label,
  },
);

const emit = defineEmits<{
  (e: "optionSelected", option: GenericOption): void;
  (e: "optionDeselected", option: GenericOption | null): void;
  (e: "search", value: string): void;
}>();

/**
 * The value of the selected option. When `isMulti` prop is set to `true`, this
 * should be an array of `OptionValue`.
 */
const selected = defineModel<OptionValue | OptionValue[]>({
  required: true,
  validator: (value, _props) => _props.isMulti ? Array.isArray(value) : !Array.isArray(value),
});

const container = ref<HTMLDivElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const menu = ref<HTMLDivElement | null>(null);

const search = ref("");
const menuOpen = ref(false);
const focusedOption = ref(-1);

const filteredOptions = computed(() => {
  // Remove already selected values from the list of options, when in multi-select mode.
  const filterMultiSelectedValues = (options: GenericOption[]) => options.filter(
    (option) => !(selected.value as OptionValue[]).includes(option.value),
  );

  if (props.isSearchable && search.value) {
    const matchingOptions = props.options.filter((option) => {
      const optionLabel = props.isMulti ? props.getMultiValueLabel(option) : props.getOptionLabel(option);

      return props.filterBy(option, optionLabel, search.value);
    });

    return props.isMulti ? filterMultiSelectedValues(matchingOptions) : matchingOptions;
  }

  return props.isMulti ? filterMultiSelectedValues(props.options) : props.options;
});

const selectedOptions = computed(() => {
  if (props.isMulti) {
    // We can safely assume it's an array due to the `isMulti` prop validation done earlier.
    return (selected.value as OptionValue[]).map(
      (value) => props.options.find((option) => option.value === value)!,
    );
  }

  const found = props.options.find((option) => option.value === selected.value);

  return found ? [found] : [];
});

const openMenu = (options?: { focusInput?: boolean }) => {
  menuOpen.value = true;
  focusedOption.value = 0;

  if (options?.focusInput && input.value) {
    input.value.focus();
  }
};

const closeMenu = () => {
  menuOpen.value = false;
  search.value = "";
};

const setOption = (option: GenericOption) => {
  if (props.isMulti) {
    (selected.value as OptionValue[]).push(option.value);
  }
  else {
    selected.value = option.value;
  }

  emit("optionSelected", option);

  search.value = "";

  if (props.closeOnSelect) {
    menuOpen.value = false;
  }

  if (input.value) {
    input.value.blur();
  }
};

const removeOption = (option: GenericOption) => {
  if (props.isMulti && !props.isDisabled) {
    selected.value = (selected.value as OptionValue[]).filter((value) => value !== option.value);
    emit("optionDeselected", option);
  }
};

const clear = () => {
  if (props.isMulti) {
    selected.value = [];
    emit("optionDeselected", null);
  }
  else {
    selected.value = undefined as OptionValue;
    emit("optionDeselected", selectedOptions.value[0]);
  }

  menuOpen.value = false;
  search.value = "";

  if (input.value) {
    input.value.blur();
  }
};

const handleNavigation = (e: KeyboardEvent) => {
  if (menuOpen.value) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusedOption.value = Math.min(focusedOption.value + 1, filteredOptions.value.length - 1);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusedOption.value = Math.max(focusedOption.value - 1, 0);
    }

    if (e.key === "Enter") {
      const selectedOption = filteredOptions.value[focusedOption.value];

      e.preventDefault();

      if (selectedOption) {
        setOption(selectedOption);
      }
    }

    // When pressing space with menu open but no search, select the focused option.
    if (e.code === "Space" && search.value.length === 0) {
      const selectedOption = filteredOptions.value[focusedOption.value];

      e.preventDefault();

      if (selectedOption) {
        setOption(selectedOption);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      menuOpen.value = false;
      search.value = "";
    }

    const hasSelectedValue = props.isMulti ? (selected.value as OptionValue[]).length > 0 : !!selected.value;

    // When pressing backspace with no search, remove the last selected option.
    if (e.key === "Backspace" && search.value.length === 0 && hasSelectedValue) {
      e.preventDefault();

      if (props.isMulti) {
        selected.value = (selected.value as OptionValue[]).slice(0, -1);
      }
      else {
        selected.value = undefined as OptionValue;
      }
    }
  }
};

/**
 * When pressing space inside the input, open the menu only if the search is
 * empty. Otherwise, the user is typing and we should skip this action.
 *
 * @param e KeyboardEvent
 */
const handleInputSpace = (e: KeyboardEvent) => {
  if (!menuOpen.value && search.value.length === 0) {
    e.preventDefault();
    e.stopImmediatePropagation();
    openMenu();
  }
};

const handleInputKeydown = (e: KeyboardEvent) => {
  if (e.key === "Tab") {
    closeMenu();
  }
  else if (e.key === "Space") {
    handleInputSpace(e);
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    menuOpen.value = false;
    search.value = "";
  }
};

const calculateMenuPosition = () => {
  if (container.value) {
    const rect = container.value.getBoundingClientRect();

    return {
      left: `${rect.x}px`,
      top: `${rect.y + rect.height}px`,
    };
  }

  console.warn("Unable to calculate dynamic menu position because of missing internal DOM reference.");

  return { top: "0px", left: "0px" };
};

watch(
  () => search.value,
  () => {
    emit("search", search.value);

    // When starting to type, open the menu automatically.
    if (search.value && !menuOpen.value) {
      openMenu();
    }
  },
);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleNavigation);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleNavigation);
});
</script>

<template>
  <div
    ref="container"
    dir="auto"
    class="vue-select"
    :class="{ open: menuOpen, typing: menuOpen && search.length > 0, disabled: isDisabled }"
  >
    <div class="control" :class="{ focused: menuOpen }">
      <div
        class="value-container"
        :class="{ multi: isMulti }"
        role="combobox"
        :aria-expanded="menuOpen"
        :aria-describedby="placeholder"
        :aria-description="placeholder"
        :aria-labelledby="aria?.labelledby"
        :aria-label="selectedOptions.length ? selectedOptions.map(isMulti ? getMultiValueLabel : getOptionLabel).join(', ') : ''"
        :aria-required="aria?.required"
      >
        <div
          v-if="!props.isMulti && selectedOptions[0]"
          class="single-value"
          @click="openMenu({ focusInput: true })"
        >
          <slot name="value" :option="selectedOptions[0]">
            {{ getOptionLabel(selectedOptions[0]) }}
          </slot>
        </div>

        <template v-if="props.isMulti && selectedOptions.length">
          <button
            v-for="(option, i) in selectedOptions"
            :key="i"
            type="button"
            class="multi-value"
            @click="removeOption(option)"
          >
            {{ getMultiValueLabel(option) }}
            <XMarkIcon />
          </button>
        </template>

        <input
          :id="inputId"
          ref="input"
          v-model="search"
          class="search-input"
          type="text"
          aria-autocomplete="list"
          autocapitalize="none"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          tabindex="0"
          :disabled="isDisabled"
          :placeholder="selectedOptions.length === 0 ? placeholder : ''"
          @mousedown="openMenu()"
          @keydown="handleInputKeydown"
        >
      </div>

      <div class="indicators-container">
        <button
          v-if="selectedOptions.length > 0 && isClearable"
          type="button"
          class="clear-button"
          tabindex="-1"
          :disabled="isDisabled"
          @click="clear"
        >
          <slot name="clear">
            <XMarkIcon />
          </slot>
        </button>

        <button
          type="button"
          class="dropdown-icon"
          tabindex="-1"
          :disabled="isDisabled"
          @click="openMenu({ focusInput: true })"
        >
          <slot name="dropdown">
            <ChevronDownIcon />
          </slot>
        </button>
      </div>
    </div>

    <Teleport :to="teleport" :disabled="!teleport">
      <div
        v-if="menuOpen"
        ref="menu"
        class="menu"
        role="listbox"
        :aria-label="aria?.labelledby"
        :aria-multiselectable="isMulti"
        :style="{
          width: props.teleport ? `${container?.getBoundingClientRect().width}px` : '100%',
          top: props.teleport ? calculateMenuPosition().top : 'unset',
          left: props.teleport ? calculateMenuPosition().left : 'unset',
        }"
      >
        <slot name="menu-header" />

        <MenuOption
          v-for="(option, i) in filteredOptions"
          :key="i"
          type="button"
          class="menu-option"
          :class="{ focused: focusedOption === i, selected: option.value === selected }"
          :menu="menu"
          :index="i"
          :is-focused="focusedOption === i"
          :is-selected="option.value === selected"
          @select="setOption(option)"
        >
          <slot name="option" :option="option">
            {{ getOptionLabel(option) }}
          </slot>
        </MenuOption>

        <div v-if="filteredOptions.length === 0" class="no-results">
          <slot name="no-options">
            No results found
          </slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
:root {
  --vs-input-bg: #fff;
  --vs-input-outline: #3b82f6;
  --vs-input-placeholder-color: #52525b;

  --vs-padding: 0.25rem 0.5rem;
  --vs-border: 1px solid #e4e4e7;
  --vs-border-radius: 4px;
  --vs-font-size: 16px;
  --vs-font-weight: 400;
  --vs-font-family: inherit;
  --vs-text-color: #18181b;
  --vs-line-height: 1.5;

  --vs-menu-offset-top: 8px;
  --vs-menu-height: 200px;
  --vs-menu-padding: 0;
  --vs-menu-border: 1px solid #e4e4e7;
  --vs-menu-bg: #fff;
  --vs-menu-box-shadow: none;
  --vs-menu-z-index: 2;

  --vs-option-padding: 8px 12px;
  --vs-option-font-size: var(--vs-font-size);
  --vs-option-font-weight: var(--vs-font-weight);
  --vs-option-text-color: var(--vs-text-color);
  --vs-option-bg: var(--vs-menu-bg);
  --vs-option-hover-color: #dbeafe;
  --vs-option-focused-color: var(--vs-option-hover-color);
  --vs-option-selected-color: #93c5fd;

  --vs-multi-value-gap: 4px;
  --vs-multi-value-padding: 4px;
  --vs-multi-value-font-size: 14px;
  --vs-multi-value-font-weight: 400;
  --vs-multi-value-line-height: 1;
  --vs-multi-value-text-color: #3f3f46;
  --vs-multi-value-bg: #f4f4f5;
  --vs-multi-value-xmark-size: 16px;
  --vs-multi-value-xmark-color: var(--vs-multi-value-text-color);

  --vs-indicators-gap: 4px;
  --vs-icon-size: 20px;
  --vs-icon-color: var(--vs-text-color);

  --vs-dropdown-transition: transform 0.25s ease-out;
}
</style>

<style lang="scss" scoped>
.vue-select {
  position: relative;
  box-sizing: border-box;
  width: 100%;

  * {
    box-sizing: border-box;
  }

  &.open {
    .single-value {
      position: absolute;
      opacity: 0.4;
    }

    .dropdown-icon {
      transform: rotate(180deg);
    }
  }

  &.typing {
    .single-value {
      opacity: 0;
    }
  }
}

.control {
  display: flex;
  min-height: 32px;
  border: var(--vs-border);
  border-radius: var(--vs-border-radius);
  background-color: var(--vs-input-bg);

  &.focused {
    box-shadow: 0 0 0 1px var(--vs-input-outline);
    border-color: var(--vs-input-outline);
  }
}

.value-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-basis: 100%;
  flex-grow: 1;
  padding: var(--vs-padding);

  &.multi {
    gap: var(--vs-multi-value-gap);
  }
}

.single-value {
  display: flex;
  align-items: center;
  font-size: var(--vs-font-size);
  font-weight: var(--vs-font-weight);
  font-family: var(--vs-font-family);
  line-height: var(--vs-line-height);
  color: var(--vs-text-color);
  z-index: 0;
}

.multi-value {
  appearance: none;
  display: flex;
  align-items: center;
  gap: var(--vs-multi-value-gap);
  padding: var(--vs-multi-value-padding);
  margin: 0;
  border: 0;
  font-size: var(--vs-multi-value-font-size);
  font-weight: var(--vs-multi-value-font-weight);
  color: var(--vs-multi-value-text-color);
  line-height: var(--vs-multi-value-line-height);
  background: var(--vs-multi-value-bg);
  outline: none;
  cursor: pointer;

  svg {
    width: var(--vs-multi-value-xmark-size);
    height: var(--vs-multi-value-xmark-size);
    fill: var(--vs-multi-value-xmark-color);
  }
}

.search-input {
  appearance: none;
  display: inline-block;
  max-width: 100%;
  flex-grow: 1;
  width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font-size: var(--vs-font-size);
  font-family: var(--vs-font-family);
  line-height: var(--vs-line-height);
  color: var(--vs-text-color);
  outline: none;
  z-index: 1;

  &::placeholder {
    color: var(--vs-input-placeholder-color);
  }
}

.indicators-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: var(--vs-indicators-gap);
  padding: var(--vs-padding);
}

.clear-button {
  appearance: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  border: 0;
  width: var(--vs-icon-size);
  height: var(--vs-icon-size);
  fill: var(--vs-icon-color);
  background: none;
  outline: none;
  cursor: pointer;
}

.dropdown-icon {
  appearance: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  border: 0;
  width: var(--vs-icon-size);
  height: var(--vs-icon-size);
  fill: var(--vs-icon-color);
  background: none;
  outline: none;
  cursor: pointer;
  transition: var(--vs-dropdown-transition);
}

.menu {
  position: absolute;
  left: 0;
  right: 0;
  padding: var(--vs-menu-padding);
  margin-top: var(--vs-menu-offset-top);
  max-height: var(--vs-menu-height);
  overflow-y: auto;
  border: var(--vs-menu-border);
  border-radius: var(--vs-border-radius);
  box-shadow: var(--vs-menu-box-shadow);
  background-color: var(--vs-menu-bg);
  z-index: var(--vs-menu-z-index);
}

.menu-option {
  display: flex;
  width: 100%;
  border: 0;
  margin: 0;
  padding: var(--vs-option-padding);
  font-size: var(--vs-option-font-size);
  font-weight: var(--vs-option-font-weight);
  font-family: var(--vs-font-family);
  color: var(--vs-option-text-color);
  background-color: var(--vs-option-bg);
  text-align: -webkit-auto;
  cursor: pointer;

  &:hover {
    background-color: var(--vs-option-hover-color);
  }

  &.focused {
    background-color: var(--vs-option-focused-color);
  }

  &.selected {
    background-color: var(--vs-option-selected-color);
  }
}

.no-results {
  padding: var(--vs-option-padding);
  font-size: var(--vs-font-size);
  font-family: var(--vs-font-family);
  color: var(--vs-text-color);
}
</style>
