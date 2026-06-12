<script setup lang="ts">
import type { CountryRecord } from "../data/options";
import { ref } from "vue";

import { Select } from "vue3-select-component";
import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryRecords } from "../data/options";

const value = ref<string | null>(null);

function getOptionLabel(option: CountryRecord) {
  return option.name;
}

function getOptionValue(option: CountryRecord) {
  return option.code;
}

function filterByRegion(option: CountryRecord, _label: string, search: string) {
  const query = search.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return option.region.toLowerCase().includes(query)
    || option.name.toLowerCase().includes(query);
}
</script>

<template>
  <DemoSection
    title="Custom filter"
    description="filterBy receives the source option object. Here, search matches region or name."
  >
    <Select
      v-model="value"
      searchable
      :options="countryRecords"
      :get-option-label="getOptionLabel"
      :get-option-value="getOptionValue"
      :filter-by="filterByRegion"
      placeholder="Search by region or name"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
