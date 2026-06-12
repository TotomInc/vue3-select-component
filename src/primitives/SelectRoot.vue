<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectModelValue } from "@/types/model";
import type { SelectRootEmits, SelectRootProps } from "@/types/root";

import { computed, toRef } from "vue";
import { useSelectCollection } from "@/composables/useSelectCollection";
import { useSelectState } from "@/composables/useSelectState";
import { provideSelectContext } from "@/lib/context";
import { resolveHTMLElement } from "@/lib/dom";
import { defaultSelectFilterBy } from "@/lib/filter";

const props = withDefaults(defineProps<SelectRootProps<OptionValue>>(), {
  multiple: false,
  searchable: false,
  disabled: false,
  clearable: false,
  loading: false,
  closeOnSelect: null,
  resetSearchOnBlur: true,
  resetSearchOnSelect: true,
  hideSelected: false,
  options: () => [],
  filterBy: defaultSelectFilterBy,
});

const emit = defineEmits<SelectRootEmits<OptionValue>>();

const model = defineModel<SelectModelValue<OptionValue>>({ default: null });

const multiple = toRef(() => props.multiple);
const disabled = toRef(() => props.disabled);
const searchable = toRef(() => props.searchable);
const clearable = toRef(() => props.clearable);
const loading = toRef(() => props.loading);
const closeOnSelect = toRef(() => props.closeOnSelect);
const resetSearchOnBlur = toRef(() => props.resetSearchOnBlur);
const resetSearchOnSelect = toRef(() => props.resetSearchOnSelect);
const hideSelected = toRef(() => props.hideSelected);
const createItem = toRef(() => props.createItem);
const propOptions = toRef(() => props.options);
const filterBy = computed(() => props.filterBy);

const collection = useSelectCollection<OptionValue>({
  propOptions: () => propOptions.value,
});

const { context } = useSelectState({
  modelValue: model,
  multiple,
  disabled,
  searchable,
  clearable,
  loading,
  closeOnSelect,
  resetSearchOnBlur,
  resetSearchOnSelect,
  hideSelected,
  createItem,
  propOptions,
  filterBy,
  collection,
  events: {
    onMenuOpened: () => emit("menuOpened"),
    onMenuClosed: () => emit("menuClosed"),
    onSearch: (value) => emit("search", value),
    onCreate: (value) => emit("create", value),
    onOptionSelected: (value) => emit("optionSelected", value),
    onOptionDeselected: (value) => emit("optionDeselected", value),
  },
});

provideSelectContext(context);

function onRootElement(element: Parameters<typeof resolveHTMLElement>[0]) {
  context.registerRootElement(resolveHTMLElement(element));
}
</script>

<template>
  <div
    :ref="onRootElement"
    data-select-root
  >
    <slot />
  </div>
</template>
