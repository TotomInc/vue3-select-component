<script setup lang="ts" generic="GenericOption extends Option<OptionValue>, OptionValue = string">
import type { Option } from "./types";

import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import SelectClearButton from "./components/SelectClearButton.vue";
import SelectDropdownButton from "./components/SelectDropdownButton.vue";
import ChevronDownIcon from "./icons/ChevronDownIcon.vue";
import XMarkIcon from "./icons/XMarkIcon.vue";
import MenuOption from "./MenuOption.vue";
import Spinner from "./Spinner.vue";

const props = withDefaults(
  defineProps<{
    options: GenericOption[];
    /**
     * When passed to the component, only these specific options will be rendered
     * on the list of options.
     */
    displayedOptions?: GenericOption[];
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
     * When set to true, allow the user to create a new option if it doesn't exist.
     */
    isTaggable?: boolean;
    /**
     * When set to true, show a loading spinner inside the select component. This is useful
     * when fetching the options asynchronously.
     */
    isLoading?: boolean;
    /**
     * Control the menu open state programmatically.
     */
    isMenuOpen?: boolean;
    /**
     * When set to true, focus the first option when the menu is opened.
     * When set to false, no option will be focused.
     */
    shouldAutofocusOption?: boolean;
    /**
     * When set to true, clear the search input when an option is selected.
     */
    closeOnSelect?: boolean;
    /**
     * Teleport the menu to another part of the DOM with higher priority such as `body`.
     * This way, you can avoid z-index issues. Menu position will be calculated using
     * JavaScript, instead of using CSS absolute & relative positioning. By default,
     * the menu will be rendered using <Teleport /> on the <body> element.
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
     * the options based on the `label` property of the option. The label is retrieved
     * using `getOptionLabel`.
     *
     * @param option The option to filter.
     * @param label The label of the option.
     * @param search The search input value.
     */
    filterBy?: (option: GenericOption, label: string, search: string) => boolean;
    /**
     * Resolves option data to a string to compare options and specify value attributes.
     *
     * @param option The option to render.
     */
    getOptionValue?: (option: GenericOption) => OptionValue;
    /**
     * Resolves option data to a string to render the option label.
     *
     * @param option The option to render.
     */
    getOptionLabel?: (option: GenericOption) => string;
  }>(),
  {
    placeholder: "Select an option",
    isClearable: true,
    isDisabled: false,
    isSearchable: true,
    isMulti: false,
    isTaggable: false,
    isLoading: false,
    isMenuOpen: undefined,
    shouldAutofocusOption: true,
    closeOnSelect: true,
    teleport: "body",
    inputId: undefined,
    aria: undefined,
    filterBy: (option: GenericOption, label: string, search: string) => label.toLowerCase().includes(search.toLowerCase()),
    getOptionValue: (option: GenericOption) => option.value,
    getOptionLabel: (option: GenericOption) => option.label,
  },
);

const emit = defineEmits<{
  (e: "optionSelected", option: GenericOption): void;
  (e: "optionDeselected", option: GenericOption | null): void;
  (e: "optionCreated", value: string): void;
  (e: "menuOpened"): void;
  (e: "menuClosed"): void;
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

const availableOptions = computed<GenericOption[]>(() => {
  const rawOptions = (props.displayedOptions || props.options);

  if (!rawOptions || !rawOptions.length) {
    console.warn("[vue3-select-component warn]: No options or displayedOptions were provided to the component.");
  }

  const options = rawOptions.map((option) => ({
    ...option,
    label: props.getOptionLabel(option),
    value: props.getOptionValue(option),
  }));

  // Remove already selected values from the list of options, when in multi-select mode.
  const getNonSelectedOptions = (options: GenericOption[]) => options.filter(
    (option) => !(selected.value as OptionValue[]).includes(option.value),
  );

  if (props.isSearchable && search.value) {
    const matchingOptions = options.filter((option) => props.filterBy(option, props.getOptionLabel(option), search.value));

    return props.isMulti ? getNonSelectedOptions(matchingOptions) : matchingOptions;
  }

  return props.isMulti ? getNonSelectedOptions(options) : options;
});

const selectedOptions = computed(() => {
  if (props.isMulti) {
    if (!Array.isArray(selected.value)) {
      console.warn(`[vue3-select-component warn]: The v-model provided should be an array when using \`isMulti\` prop, instead it was: ${selected.value}`);
    }

    return (selected.value as OptionValue[]).map(
      (value) => props.options.find((option) => option.value === value)!,
    );
  }

  const found = props.options.find((option) => props.getOptionValue(option) === selected.value);

  return found ? [found] : [];
});

const openMenu = (options?: { focusInput?: boolean }) => {
  menuOpen.value = true;

  if (props.shouldAutofocusOption) {
    focusedOption.value = props.options.findIndex((option) => !option.disabled);
  }

  if (options?.focusInput && input.value) {
    input.value.focus();
  }

  emit("menuOpened");
};

const closeMenu = () => {
  menuOpen.value = false;
  search.value = "";
  emit("menuClosed");
};

const toggleMenu = () => {
  if (menuOpen.value) {
    closeMenu();
  }
  else {
    openMenu();
  }
};

const setOption = (option: GenericOption) => {
  if (option.disabled) {
    return;
  }

  if (props.isMulti) {
    (selected.value as OptionValue[]).push(option.value);
  }
  else {
    selected.value = option.value;
  }

  emit("optionSelected", option);

  search.value = "";

  if (props.closeOnSelect) {
    closeMenu();
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

  closeMenu();

  if (input.value) {
    input.value.blur();
  }
};

const createOption = () => {
  emit("optionCreated", search.value);
  search.value = "";
  closeMenu();
};

const handleNavigation = (e: KeyboardEvent) => {
  if (menuOpen.value) {
    const currentIndex = focusedOption.value;

    if (e.key === "ArrowDown") {
      e.preventDefault();

      const nextOptionIndex = availableOptions.value.findIndex((option, i) => !option.disabled && i > currentIndex);
      const firstOptionIndex = availableOptions.value.findIndex((option) => !option.disabled);

      focusedOption.value = nextOptionIndex === -1 ? firstOptionIndex : nextOptionIndex;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      const prevOptionIndex = availableOptions.value.reduce(
        (acc, option, i) => (!option.disabled && i < currentIndex ? i : acc),
        -1,
      );

      const lastOptionIndex = availableOptions.value.reduce(
        (acc, option, i) => (!option.disabled ? i : acc),
        -1,
      );

      focusedOption.value = prevOptionIndex === -1 ? lastOptionIndex : prevOptionIndex;
    }

    if (e.key === "Enter") {
      const selectedOption = availableOptions.value[currentIndex];

      e.preventDefault();

      if (selectedOption) {
        setOption(selectedOption);
      }
      else if (props.isTaggable && search.value) {
        createOption();
      }
    }

    // When pressing space with menu open but no search, select the focused option.
    if (e.code === "Space" && search.value.length === 0) {
      const selectedOption = availableOptions.value[currentIndex];

      e.preventDefault();

      if (selectedOption) {
        setOption(selectedOption);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
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

const handleInputKeydown = (e: KeyboardEvent) => {
  if (e.key === "Tab") {
    closeMenu();
  }
  else if (e.code === "Space" && !menuOpen.value && search.value.length === 0) {
    e.preventDefault();
    e.stopImmediatePropagation();
    openMenu();
  }
};

const handleClickOutside = (event: MouseEvent) => {
  // Close the menu when clicking outside the component.
  // Since the menu can be teleported, we need to check if the click was outside the container or the menu.
  if (container.value && menu.value && !container.value.contains(event.target as Node) && !menu.value.contains(event.target as Node)) {
    closeMenu();
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

watch(
  () => props.isMenuOpen,
  (newValue) => {
    if (newValue) {
      openMenu({ focusInput: true });
    }
    else {
      closeMenu();
    }
  },
  { immediate: true },
);

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleNavigation);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
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
        :aria-label="selectedOptions.length ? selectedOptions.map(getOptionLabel).join(', ') : ''"
        :aria-required="aria?.required"
      >
        <div
          v-if="!props.isMulti && selectedOptions[0]"
          class="single-value"
          @click="!props.isDisabled ? openMenu({ focusInput: true }) : null"
        >
          <slot name="value" :option="selectedOptions[0]">
            {{ getOptionLabel(selectedOptions[0]) }}
          </slot>
        </div>

        <template v-if="props.isMulti && selectedOptions.length">
          <template
            v-for="selectedOption in selectedOptions"
            :key="selectedOption.value"
          >
            <slot
              name="tag"
              :option="selectedOption"
              :remove-option="() => removeOption(selectedOption)"
            >
              <button
                type="button"
                class="multi-value"
                @click="removeOption(selectedOption)"
              >
                {{ getOptionLabel(selectedOption) }}<XMarkIcon />
              </button>
            </slot>
          </template>
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
        <SelectClearButton
          v-if="selectedOptions.length > 0 && isClearable && !isLoading"
          :disabled="isDisabled"
          @clear="clear"
        >
          <slot name="clear">
            <XMarkIcon />
          </slot>
        </SelectClearButton>

        <SelectDropdownButton
          v-if="!isLoading"
          :disabled="isDisabled"
          @toggle="toggleMenu"
        >
          <slot name="dropdown">
            <ChevronDownIcon />
          </slot>
        </SelectDropdownButton>

        <slot name="loading">
          <Spinner v-if="isLoading" />
        </slot>
      </div>
    </div>

    <Teleport :disabled="!teleport" :to="teleport">
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
          v-for="(option, i) in availableOptions"
          :key="i"
          type="button"
          class="menu-option"
          :class="{ focused: focusedOption === i, selected: option.value === selected }"
          :menu="menu"
          :index="i"
          :is-focused="focusedOption === i"
          :is-selected="option.value === selected"
          :is-disabled="option.disabled || false"
          @select="setOption(option)"
        >
          <slot name="option" :option="option">
            {{ getOptionLabel(option) }}
          </slot>
        </MenuOption>

        <div v-if="!isTaggable && availableOptions.length === 0" class="no-results">
          <slot name="no-options">
            No results found
          </slot>
        </div>

        <div
          v-if="isTaggable && search"
          class="taggable-no-options"
          @click="createOption"
        >
          <slot
            name="taggable-no-options"
            :option="search"
          >
            Press enter to add {{ search }} option
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
  --vs-option-disabled-color: #f4f4f5;
  --vs-option-disabled-text-color: #52525b;

  --vs-multi-value-gap: 0px;
  --vs-multi-value-padding: 4px;
  --vs-multi-value-margin: 4px 0px 4px 6px;
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

  --vs-spinner-color: var(--vs-text-color);
  --vs-spinner-size: 20px;

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

  &.multi {
    gap: var(--vs-multi-value-gap);
  }
}

.single-value {
  display: flex;
  align-items: center;
  padding: var(--vs-padding);
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
  margin: var(--vs-multi-value-margin);
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
  padding: var(--vs-padding);
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
  border: 0;
  margin: 0;
  padding: var(--vs-option-padding);
  font-size: var(--vs-option-font-size);
  font-weight: var(--vs-option-font-weight);
  font-family: var(--vs-font-family);
  color: var(--vs-option-text-color);
  white-space: break-spaces;
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

  &.disabled {
    background-color: var(--vs-option-disabled-color);
    color: var(--vs-option-disabled-text-color);
  }
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
