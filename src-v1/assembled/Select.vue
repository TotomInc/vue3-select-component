<script setup lang="ts" generic="OptionValue extends string | number = string, GenericOption = SelectOptionData<OptionValue>">
import type { AssembledSelectEmits, AssembledSelectProps } from "@v1/types/assembled";
import type { SelectModelValue } from "@v1/types/model";
import type { SelectOption as SelectOptionData } from "@v1/types/option";

import {
  createGenericFilterByAdapter,
  createOptionMappers,
  findSourceOptionByValue,
  normalizeSelectOptions,
} from "@v1/lib/normalize-options";
import SelectClear from "@v1/primitives/SelectClear.vue";
import SelectIndicator from "@v1/primitives/SelectIndicator.vue";
import SelectInput from "@v1/primitives/SelectInput.vue";
import SelectListbox from "@v1/primitives/SelectListbox.vue";
import SelectNoOptions from "@v1/primitives/SelectNoOptions.vue";
import SelectOptionItem from "@v1/primitives/SelectOption.vue";
import SelectPopover from "@v1/primitives/SelectPopover.vue";
import SelectRoot from "@v1/primitives/SelectRoot.vue";
import SelectTrigger from "@v1/primitives/SelectTrigger.vue";
import SelectValue from "@v1/primitives/SelectValue.vue";
import { resolveAssembledBooleanProps } from "@v1/types/assembled";
import { computed, toRef } from "vue";

const props = withDefaults(defineProps<AssembledSelectProps<GenericOption, OptionValue>>(), {
  multiple: undefined,
  searchable: undefined,
  clearable: undefined,
  disabled: undefined,
  loading: undefined,
  isMulti: undefined,
  isSearchable: undefined,
  isClearable: undefined,
  isDisabled: undefined,
  isLoading: undefined,
});

const emit = defineEmits<AssembledSelectEmits<GenericOption>>();

const model = defineModel<SelectModelValue<OptionValue>>({ default: null });

const sourceOptions = toRef(() => props.options);

const optionMappers = computed(() => createOptionMappers<GenericOption, OptionValue>({
  getOptionValue: props.getOptionValue,
  getOptionLabel: props.getOptionLabel,
}));

const normalizedOptions = computed(() =>
  normalizeSelectOptions(sourceOptions.value, optionMappers.value),
);

const resolvedBooleanProps = computed(() => resolveAssembledBooleanProps(props));

const adaptedFilterBy = computed(() =>
  createGenericFilterByAdapter(
    sourceOptions.value,
    optionMappers.value,
    props.filterBy,
  ),
);

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
    :multiple="resolvedBooleanProps.multiple"
    :searchable="resolvedBooleanProps.searchable"
    :clearable="resolvedBooleanProps.clearable"
    :disabled="resolvedBooleanProps.disabled"
    :loading="resolvedBooleanProps.loading"
    :filter-by="adaptedFilterBy"
    data-v1-assembled-select
    @menu-opened="emit('menuOpened')"
    @menu-closed="emit('menuClosed')"
    @search="emit('search', $event)"
    @option-selected="emitSourceOptionSelected"
    @option-deselected="emitSourceOptionDeselected"
  >
    <SelectTrigger>
      <SelectValue :placeholder="placeholder" />
      <SelectIndicator />
      <SelectClear />
    </SelectTrigger>

    <SelectPopover :teleport="teleport">
      <SelectInput />
      <SelectListbox>
        <SelectNoOptions />
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
