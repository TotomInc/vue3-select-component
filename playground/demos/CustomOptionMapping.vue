<script setup lang="ts">
import type { CountryRecord } from "../data/options";
import { ref } from "vue";

import { Select } from "vue3-select-component";
import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryRecords } from "../data/options";

const value = ref<string | null>(null);

function getOptionLabel(option: CountryRecord) {
  return `${option.name} (${option.region})`;
}

function getOptionValue(option: CountryRecord) {
  return option.code;
}
</script>

<template>
  <DemoSection
    title="Custom option mapping"
    description="Use getOptionLabel and getOptionValue when options don't follow the default { label, value } shape."
  >
    <Select
      v-model="value"
      :options="countryRecords"
      :get-option-label="getOptionLabel"
      :get-option-value="getOptionValue"
      placeholder="Select a country"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
