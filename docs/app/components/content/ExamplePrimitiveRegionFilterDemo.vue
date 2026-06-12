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

import { countryRecords } from "~/utils/demo-options";

const selected = ref<string | null>(null);

function filterByRegion(
  option: { label: string; value: string },
  search: string,
) {
  const query = search.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const record = countryRecords.find((entry) => entry.code === option.value);

  return option.label.toLowerCase().includes(query)
    || record?.region.toLowerCase().includes(query) === true;
}
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot
      v-model="selected"
      searchable
      :filter-by="filterByRegion"
    >
      <SelectTrigger>
        <SelectValue placeholder="Search by country or region" />
        <SelectInput />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectNoOptions />
          <SelectOption
            v-for="country in countryRecords"
            :key="country.code"
            :value="country.code"
            :label="country.name"
          >
            <span class="select-primitive-option select-primitive-option--row">
              <span class="select-primitive-option__label">{{ country.name }}</span>
              <span class="select-primitive-option__region">{{ country.region }}</span>
            </span>
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
