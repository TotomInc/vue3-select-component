<script setup lang="ts" generic="GenericOption extends Option<OptionValue>, OptionValue = string">
import type { Option, Props } from "./types";

import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import ChevronDownIcon from "./icons/ChevronDownIcon.vue";
import XMarkIcon from "./icons/XMarkIcon.vue";
import Indicators from "./Indicators.vue";
import MenuOption from "./MenuOption.vue";
import MultiValue from "./MultiValue.vue";
import Placeholder from "./Placeholder.vue";
import Spinner from "./Spinner.vue";

const props = withDefaults(
  defineProps<Props<GenericOption, OptionValue>>(),
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
    teleport: undefined,
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

const selected = defineModel<OptionValue | OptionValue[]>({
  required: true,
  validator: (value, _props) => _props.isMulti ? Array.isArray(value) : !Array.isArray(value),
});

const containerRef = useTemplateRef("container");
const inputRef = useTemplateRef("input");
const menuRef = useTemplateRef("menu");
const indicatorsRef = useTemplateRef("indicators");

const search = ref("");
const menuOpen = ref(false);
const focusedOption = ref(-1);

const availableOptions = computed<GenericOption[]>(() => {
  const rawOptions = (props.displayedOptions || props.options);

  if (!rawOptions?.length) {
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

function openMenu() {
  if (props.isDisabled) {
    return;
  }

  menuOpen.value = true;

  if (props.shouldAutofocusOption) {
    focusedOption.value = props.options.findIndex((option) => !option.disabled);
  }

  if (inputRef.value) {
    inputRef.value.focus();
  }

  emit("menuOpened");
};

function closeMenu() {
  menuOpen.value = false;
  search.value = "";
  emit("menuClosed");
};

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu();
  }
  else {
    openMenu();
  }
};

function handleControlClick(event: MouseEvent) {
  if (indicatorsRef.value?.containerRef && !indicatorsRef.value.containerRef.contains(event.target as Node)) {
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

  if (inputRef.value) {
    inputRef.value.blur();
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

  if (inputRef.value) {
    inputRef.value.blur();
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
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    closeMenu();
  }
};

const calculateMenuPosition = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();

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
      openMenu();
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
    :class="[{ open: menuOpen, typing: menuOpen && search.length > 0, disabled: isDisabled }, props.class]"
    :data-state="menuOpen ? 'open' : 'closed'"
  >
    <div
      class="control"
      :class="{ focused: menuOpen, disabled: props.isDisabled }"
      @click="handleControlClick($event)"
    >
      <div
        class="value-container"
        :class="{ 'multi': isMulti, 'has-value': selectedOptions.length > 0 }"
        role="combobox"
        :aria-expanded="menuOpen"
        :aria-describedby="placeholder"
        :aria-description="placeholder"
        :aria-labelledby="aria?.labelledby"
        :aria-label="selectedOptions.length ? selectedOptions.map(getOptionLabel).join(', ') : ''"
        :aria-required="aria?.required"
        aria-haspopup="true"
      >
        <Placeholder
          v-if="!selectedOptions[0] && !search.length"
          :text="placeholder"
        />

        <div
          v-else-if="!props.isMulti && selectedOptions[0]"
          class="single-value"
          @click="openMenu()"
        >
          <slot name="value" :option="selectedOptions[0]">
            {{ getOptionLabel(selectedOptions[0]) }}
          </slot>
        </div>

        <template
          v-for="selectedOption in selectedOptions"
          v-else-if="props.isMulti && selectedOptions.length"
          :key="selectedOption.value"
        >
          <slot
            name="tag"
            :option="selectedOption"
            :remove-option="() => removeOption(selectedOption)"
          >
            <MultiValue :label="getOptionLabel(selectedOption)" @remove="removeOption(selectedOption)" />
          </slot>
        </template>

        <div
          class="input-container"
          :class="{ typing: menuOpen && search.length > 0 }"
          :data-value="search"
        >
          <input
            :id="inputId"
            ref="input"
            v-model="search"
            class="search-input"
            autocapitalize="none"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            tabindex="0"
            type="text"
            aria-autocomplete="list"
            :disabled="isDisabled"
            placeholder=""
            @mousedown="openMenu()"
            @keydown="handleInputKeydown"
          >
        </div>
      </div>

      <Indicators
        ref="indicators"
        :has-selected-option="selectedOptions.length > 0"
        :is-menu-open="menuOpen"
        :is-clearable="isClearable"
        :is-loading="isLoading"
        :is-disabled="isDisabled"
        @clear="clear"
        @toggle="toggleMenu"
      >
        <template #clear>
          <slot name="clear">
            <XMarkIcon />
          </slot>
        </template>

        <template #dropdown>
          <slot name="dropdown">
            <ChevronDownIcon />
          </slot>
        </template>

        <template #loading>
          <slot name="loading">
            <Spinner v-if="isLoading" />
          </slot>
        </template>
      </Indicators>
    </div>

    <Teleport
      :to="teleport"
      :disabled="!teleport"
      :defer="true"
    >
      <div
        v-if="menuOpen"
        ref="menu"
        class="menu"
        role="listbox"
        :aria-label="aria?.labelledby"
        :aria-multiselectable="isMulti"
        :style="{
          width: props.teleport ? `${containerRef?.getBoundingClientRect().width}px` : '100%',
          top: props.teleport ? calculateMenuPosition().top : 'unset',
          left: props.teleport ? calculateMenuPosition().left : 'unset',
        }"
      >
        <slot name="menu-header" />

        <MenuOption
          v-for="(option, i) in availableOptions"
          :key="i"
          type="button"
          :menu="menuRef"
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
  --vs-width: 100%;
  --vs-min-height: 38px;
  --vs-padding: 4px 8px;
  --vs-border: 1px solid #e4e4e7;
  --vs-border-radius: 4px;
  --vs-font-size: 16px;
  --vs-font-weight: 400;
  --vs-font-family: inherit;
  --vs-text-color: #18181b;
  --vs-line-height: 1.5;
  --vs-placeholder-color: #52525b;
  --vs-background-color: #fff;
  --vs-disabled-background-color: #f4f4f5;
  --vs-outline-width: 1px;
  --vs-outline-color: #3b82f6;

  --vs-menu-offset-top: 8px;
  --vs-menu-height: 200px;
  --vs-menu-border: var(--vs-border);
  --vs-menu-background-color: var(--vs-background-color);
  --vs-menu-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --vs-menu-z-index: 2;

  --vs-option-width: 100%;
  --vs-option-padding: 8px 12px;
  --vs-option-cursor: pointer;
  --vs-option-font-size: var(--vs-font-size);
  --vs-option-font-weight: var(--vs-font-weight);
  --vs-option-text-align: -webkit-auto;
  --vs-option-text-color: var(--vs-text-color);
  --vs-option-hover-text-color: var(--vs-text-color);
  --vs-option-focused-text-color: var(--vs-text-color);
  --vs-option-selected-text-color: var(--vs-text-color);
  --vs-option-disabled-text-color: #52525b;
  --vs-option-background-color: var(--vs-menu-background);
  --vs-option-hover-background-color: #dbeafe;
  --vs-option-focused-background-color: var(--vs-option-hover-background-color);
  --vs-option-selected-background-color: #93c5fd;
  --vs-option-disabled-background-color: #f4f4f5;
  --vs-option-opacity-menu-open: 0.4;

  --vs-multi-value-margin: 2px;
  --vs-multi-value-border: 0px;
  --vs-multi-value-border-radius: 2px;
  --vs-multi-value-background-color: #f4f4f5;

  --vs-multi-value-label-padding: 4px 4px 4px 8px;
  --vs-multi-value-label-font-size: 12px;
  --vs-multi-value-label-font-weight: 400;
  --vs-multi-value-label-line-height: 1;
  --vs-multi-value-label-text-color: #3f3f46;

  --vs-multi-value-delete-padding: 0 3px;
  --vs-multi-value-delete-hover-background-color: #FF6467;
  --vs-multi-value-xmark-size: 16px;
  --vs-multi-value-xmark-cursor: pointer;
  --vs-multi-value-xmark-color: var(--vs-multi-value-label-text-color);
  --vs-multi-value-xmark-hover-color: #fff;

  --vs-indicators-gap: 0px;
  --vs-indicator-icon-size: 20px;
  --vs-indicator-icon-color: var(--vs-text-color);
  --vs-indicator-icon-cursor: pointer;
  --vs-indicator-dropdown-icon-transition: transform 0.2s ease-out;

  --vs-spinner-color: var(--vs-text-color);
  --vs-spinner-size: 16px;
}
</style>

<style lang="css" scoped>
* {
  box-sizing: border-box;
}

.vue-select {
  position: relative;
  box-sizing: border-box;
  width: var(--vs-width);
}

.control {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  min-height: var(--vs-min-height);
  border: var(--vs-border);
  border-radius: var(--vs-border-radius);
  background-color: var(--vs-background-color);
}

.control.focused {
  box-shadow: 0 0 0 var(--vs-outline-width) var(--vs-outline-color);
  border-color: var(--vs-outline-color);
}

.control.disabled {
  background-color: var(--vs-disabled-background-color);
}

.value-container {
  position: relative;
  overflow: hidden;
  display: grid;
  align-items: center;
  flex: 1 1 0%;
  padding: var(--vs-padding);
}

.value-container.multi.has-value {
  display: flex;
  flex-wrap: wrap;
}

.single-value {
  display: block;
  grid-area: 1 / 1 / 2 / 3;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--vs-font-size);
  font-weight: var(--vs-font-weight);
  font-family: var(--vs-font-family);
  line-height: var(--vs-line-height);
  color: var(--vs-text-color);
}

.vue-select[data-state="open"] .single-value {
  opacity: var(--vs-option-opacity-menu-open);
}

.vue-select.typing .single-value {
  opacity: 0;
}

.input-container {
  visibility: visible;
  display: inline-grid;
  grid-area: 1 / 1 / 2 / 3;
  grid-template-columns: 0px min-content;
}

.input-container.typing {
  transform: translateZ(0px);
}

.input-container.typing::after {
  content: attr(data-value) " ";
  visibility: hidden;
  white-space: pre;
  grid-area: 1 / 2;
  min-width: 2px;
  padding: 0;
  margin: 0;
  border: 0;
}

.search-input {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 2px;
  width: 100%;
  grid-area: 1 / 2;
  background: 0px center;
  font-size: var(--vs-font-size);
  font-family: var(--vs-font-family);
  line-height: var(--vs-line-height);
  color: var(--vs-text-color);
  opacity: 1;
  outline: none;
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
