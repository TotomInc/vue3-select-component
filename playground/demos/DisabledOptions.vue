<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryOptionsWithDisabled } from "../data/options";

const value = ref<string | null>(null);
</script>

<template>
  <DemoSection
    title="Disabled options"
    description="Individual options can be marked disabled and cannot be selected."
  >
    <Select
      v-model="value"
      :options="countryOptionsWithDisabled"
      placeholder="Select a country"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
