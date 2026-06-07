<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectModelValue } from "@v1/types/model";
import type { SelectOption as SelectOptionData } from "@v1/types/option";

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

type AssembledSelectProps<OptionValue> = {
  options: SelectOptionData<OptionValue>[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

withDefaults(defineProps<AssembledSelectProps<OptionValue>>(), {
  multiple: false,
  searchable: false,
  clearable: false,
  disabled: false,
  loading: false,
});

const model = defineModel<SelectModelValue<OptionValue>>({ default: null });
</script>

<template>
  <SelectRoot
    v-model="model"
    :multiple="multiple"
    :searchable="searchable"
    :clearable="clearable"
    :disabled="disabled"
    :loading="loading"
    :options="options"
    data-v1-assembled-select
  >
    <SelectTrigger>
      <SelectValue :placeholder="placeholder" />
      <SelectIndicator />
      <SelectClear />
    </SelectTrigger>

    <SelectPopover>
      <SelectInput />
      <SelectListbox>
        <SelectNoOptions />
        <SelectOptionItem
          v-for="option in options"
          :key="String(option.value)"
          :value="option.value"
          :label="option.label"
          :disabled="option.disabled"
        />
      </SelectListbox>
    </SelectPopover>
  </SelectRoot>
</template>
