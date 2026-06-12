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

const selected = ref<string | null>(null);
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot v-model="selected" searchable>
      <SelectTrigger>
        <SelectValue placeholder="Search countries" />
        <SelectInput />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectNoOptions>
            <template #default="{ searchValue }">
              <span class="select-primitive-empty">
                No country matches "{{ searchValue }}"
              </span>
            </template>
          </SelectNoOptions>
          <SelectOption
            v-for="option in countryOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </SelectListbox>
      </SelectPopover>
    </SelectRoot>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
