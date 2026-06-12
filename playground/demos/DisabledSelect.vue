<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { simpleOptions } from "../data/options";

const value = ref<string | null>("option_1");
</script>

<template>
  <DemoSection
    title="Disabled"
    description="The entire select is non-interactive when disabled."
  >
    <Select
      v-model="value"
      disabled
      :options="simpleOptions"
      placeholder="Select an option"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
