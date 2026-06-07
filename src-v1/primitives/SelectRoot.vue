<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectModelValue } from "@v1/types/model";
import type { SelectRootProps } from "@v1/types/root";

import { useSelectCollection } from "@v1/composables/useSelectCollection";
import { useSelectState } from "@v1/composables/useSelectState";
import { provideSelectContext } from "@v1/lib/context";
import { resolveHTMLElement } from "@v1/lib/dom";
import { defaultSelectFilterBy } from "@v1/lib/filter";
import { computed, toRef } from "vue";

const props = withDefaults(defineProps<SelectRootProps<OptionValue>>(), {
  multiple: false,
  searchable: false,
  disabled: false,
  clearable: false,
  loading: false,
  options: () => [],
  filterBy: defaultSelectFilterBy,
});

const model = defineModel<SelectModelValue<OptionValue>>({ default: null });

const multiple = toRef(() => props.multiple);
const disabled = toRef(() => props.disabled);
const searchable = toRef(() => props.searchable);
const clearable = toRef(() => props.clearable);
const loading = toRef(() => props.loading);
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
  propOptions,
  filterBy,
  collection,
});

provideSelectContext(context);

function onRootElement(element: Parameters<typeof resolveHTMLElement>[0]) {
  context.registerRootElement(resolveHTMLElement(element));
}
</script>

<template>
  <div
    :ref="onRootElement"
    data-v1-select-root
  >
    <slot />
  </div>
</template>
