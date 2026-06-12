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
    title="No options slot"
    description="Customize the empty state when filtering returns no results."
  >
    <Select
      v-model="value"
      searchable
      :options="countryOptions"
      placeholder="Search countries"
    >
      <template #no-options="{ searchValue }">
        <span class="demo-empty">
          No country matches "{{ searchValue }}"
        </span>
      </template>
    </Select>
    <DemoValue :value="value" />
  </DemoSection>
</template>
