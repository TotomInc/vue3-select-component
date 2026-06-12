<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryOptions } from "../data/options";

const value = ref<string[]>(["FR", "GB", "DE"]);
</script>

<template>
  <DemoSection
    title="Tag remove slot"
    description="Replace the default tag remove icon with custom content."
  >
    <Select
      v-model="value"
      multiple
      :options="countryOptions"
      placeholder="Select countries"
    >
      <template #tag-remove>
        <span aria-hidden="true" class="demo-tag-remove">×</span>
      </template>
    </Select>
    <DemoValue :value="value" />
  </DemoSection>
</template>
