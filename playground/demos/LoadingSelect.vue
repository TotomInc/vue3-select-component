<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryOptions } from "../data/options";

const value = ref<string | null>(null);
const loading = ref(true);
</script>

<template>
  <DemoSection
    title="Loading"
    description="Shows a loading indicator on the trigger. Toggle to compare states."
  >
    <label class="demo-toggle">
      <input v-model="loading" type="checkbox">
      Loading
    </label>

    <Select
      v-model="value"
      :loading="loading"
      :options="countryOptions"
      placeholder="Select a country"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
