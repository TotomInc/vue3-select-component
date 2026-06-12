<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryOptions } from "../data/options";

const value = ref<string | null>(null);
</script>

<template>
  <DemoSection
    title="Searchable"
    description="Filter options by typing directly in the trigger."
  >
    <Select
      v-model="value"
      :options="countryOptions"
      placeholder="Search countries"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
