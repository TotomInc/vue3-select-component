<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryOptions } from "../data/options";

const value = ref<string | null>("FR");
</script>

<template>
  <DemoSection
    title="Clearable"
    description="Shows a clear button when a value is selected."
  >
    <Select
      v-model="value"
      clearable
      :options="countryOptions"
      placeholder="Select a country"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
