<script setup lang="ts">
import { ref } from "vue";
import {
  SelectInput,
  SelectListbox,
  SelectNoOptions,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

import { countryOptions } from "~/utils/demo-options";

const selected = ref<string[]>(["FR", "DE"]);
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot v-model="selected" multiple searchable>
      <SelectTrigger>
        <SelectValue placeholder="Select countries">
          <template #tag-remove="{ label }">
            <span :aria-label="`Remove ${label}`">×</span>
          </template>
        </SelectValue>
        <SelectInput />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectNoOptions />
          <SelectOption
            v-for="option in countryOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            <template #checkmark>
              <span aria-hidden="true">✓</span>
            </template>
          </SelectOption>
        </SelectListbox>
      </SelectPopover>
    </SelectRoot>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
