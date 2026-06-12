<script setup lang="ts" generic="OptionValue extends string | number = string, GenericOption = SelectOptionData<OptionValue>">
import type { AssembledSelectEmits, AssembledSelectProps } from "@/types/assembled";
import type { SelectModelValue } from "@/types/model";
import type { SelectOption as SelectOptionData } from "@/types/option";

import { computed, toRef, useAttrs } from "vue";
import {
  createGenericFilterByAdapter,
  createOptionMappers,
  findSourceOptionByValue,
  normalizeSelectOptions,
} from "@/lib/normalize-options";
import SelectClear from "@/primitives/SelectClear.vue";
import SelectIcon from "@/primitives/SelectIcon.vue";
import SelectInput from "@/primitives/SelectInput.vue";
import SelectListbox from "@/primitives/SelectListbox.vue";
import SelectNoOptions from "@/primitives/SelectNoOptions.vue";
import SelectOptionItem from "@/primitives/SelectOption.vue";
import SelectPopover from "@/primitives/SelectPopover.vue";
import SelectRoot from "@/primitives/SelectRoot.vue";
import SelectTrailingIcon from "@/primitives/SelectTrailingIcon.vue";
import SelectTrigger from "@/primitives/SelectTrigger.vue";
import SelectValue from "@/primitives/SelectValue.vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AssembledSelectProps<GenericOption, OptionValue>>(), {
  teleport: true,
  multiple: false,
  searchable: true,
  clearable: false,
  disabled: false,
  loading: false,
  closeOnSelect: null,
  hideSelected: false,
});

const emit = defineEmits<AssembledSelectEmits<GenericOption>>();

const model = defineModel<SelectModelValue<OptionValue>>({ default: null });
const attrs = useAttrs();

const sourceOptions = toRef(() => props.options);
const controlAttributeNames = new Set([
  "id",
  "name",
  "form",
  "required",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-invalid",
  "aria-required",
]);

const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !controlAttributeNames.has(name)),
  ),
);

const controlAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => controlAttributeNames.has(name)),
  ),
);

const triggerAttrs = computed(() => props.searchable ? {} : controlAttrs.value);
const inputAttrs = computed(() => props.searchable ? controlAttrs.value : {});

const optionMappers = computed(() => createOptionMappers<GenericOption, OptionValue>({
  getOptionValue: props.getOptionValue,
  getOptionLabel: props.getOptionLabel,
}));

const normalizedOptions = computed(() =>
  normalizeSelectOptions(sourceOptions.value, optionMappers.value),
);

const adaptedFilterBy = computed(() =>
  createGenericFilterByAdapter(
    sourceOptions.value,
    optionMappers.value,
    props.filterBy,
  ),
);

const popoverProps = computed(() => {
  const {
    multiple: _multiple,
    searchable: _searchable,
    clearable: _clearable,
    disabled: _disabled,
    loading: _loading,
    options: _options,
    placeholder: _placeholder,
    closeOnSelect: _closeOnSelect,
    hideSelected: _hideSelected,
    filterBy: _filterBy,
    getOptionValue: _getOptionValue,
    getOptionLabel: _getOptionLabel,
    ...rest
  } = props;

  return rest;
});

function emitSourceOptionSelected(value: OptionValue) {
  const sourceOption = findSourceOptionByValue(
    sourceOptions.value,
    optionMappers.value,
    value,
  );

  if (sourceOption != null) {
    emit("optionSelected", sourceOption);
  }
}

function emitSourceOptionDeselected(value: OptionValue | null) {
  if (value == null) {
    emit("optionDeselected", null);
    return;
  }

  const sourceOption = findSourceOptionByValue(
    sourceOptions.value,
    optionMappers.value,
    value,
  );

  if (sourceOption != null) {
    emit("optionDeselected", sourceOption);
  }
}
</script>

<template>
  <SelectRoot
    v-model="model"
    :options="normalizedOptions"
    :multiple="multiple"
    :searchable="searchable"
    :clearable="clearable"
    :disabled="disabled"
    :loading="loading"
    :close-on-select="closeOnSelect"
    :hide-selected="hideSelected"
    :filter-by="adaptedFilterBy"
    data-assembled-select
    v-bind="rootAttrs"
    @menu-opened="emit('menuOpened')"
    @menu-closed="emit('menuClosed')"
    @search="emit('search', $event)"
    @option-selected="emitSourceOptionSelected"
    @option-deselected="emitSourceOptionDeselected"
  >
    <SelectTrigger v-bind="triggerAttrs">
      <SelectIcon v-if="$slots.icon">
        <slot name="icon" />
      </SelectIcon>
      <SelectValue :placeholder="placeholder">
        <template v-if="$slots['tag-remove']" #tag-remove="tagRemoveSlotProps">
          <slot name="tag-remove" v-bind="tagRemoveSlotProps" />
        </template>
      </SelectValue>
      <SelectInput v-bind="inputAttrs" />
      <SelectTrailingIcon>
        <template v-if="$slots['trailing-icon']" #default="trailingIconSlotProps">
          <slot name="trailing-icon" v-bind="trailingIconSlotProps" />
        </template>
      </SelectTrailingIcon>
      <SelectClear v-if="clearable">
        <template v-if="$slots.clear" #default>
          <slot name="clear" />
        </template>
      </SelectClear>
    </SelectTrigger>

    <SelectPopover v-bind="popoverProps">
      <SelectListbox>
        <SelectNoOptions>
          <template v-if="$slots['no-options']" #default="noOptionsSlotProps">
            <slot name="no-options" v-bind="noOptionsSlotProps" />
          </template>
        </SelectNoOptions>
        <SelectOptionItem
          v-for="option in normalizedOptions"
          :key="String(option.value)"
          :value="option.value"
          :label="option.label"
          :disabled="option.disabled"
        />
      </SelectListbox>
    </SelectPopover>
  </SelectRoot>
</template>
