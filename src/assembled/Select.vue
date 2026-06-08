<script setup lang="ts" generic="OptionValue extends string | number = string, GenericOption = SelectOptionData<OptionValue>">
import type { AssembledSelectEmits, AssembledSelectProps } from "@/types/assembled";
import type { SelectModelValue } from "@/types/model";
import type { SelectOption as SelectOptionData } from "@/types/option";

import { computed, toRef } from "vue";
import {
  createGenericFilterByAdapter,
  createOptionMappers,
  findSourceOptionByValue,
  normalizeSelectOptions,
} from "@/lib/normalize-options";
import SelectClear from "@/primitives/SelectClear.vue";
import SelectIndicator from "@/primitives/SelectIndicator.vue";
import SelectInput from "@/primitives/SelectInput.vue";
import SelectListbox from "@/primitives/SelectListbox.vue";
import SelectNoOptions from "@/primitives/SelectNoOptions.vue";
import SelectOptionItem from "@/primitives/SelectOption.vue";
import SelectPopover from "@/primitives/SelectPopover.vue";
import SelectRoot from "@/primitives/SelectRoot.vue";
import SelectTrigger from "@/primitives/SelectTrigger.vue";
import SelectValue from "@/primitives/SelectValue.vue";
import { resolveAssembledBooleanProps } from "@/types/assembled";

const props = withDefaults(defineProps<AssembledSelectProps<GenericOption, OptionValue>>(), {
  multiple: undefined,
  searchable: undefined,
  clearable: undefined,
  disabled: undefined,
  loading: undefined,
  closeOnSelect: null,
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
    :close-on-select="closeOnSelect"
    :filter-by="adaptedFilterBy"
    data-assembled-select
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
