<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { languageOptions } from "../data/options";

const value = ref<string[]>([]);
</script>

<template>
  <DemoSection
    title="Multi select"
    description="Select multiple values. The menu stays open after each selection by default."
  >
    <Select
      v-model="value"
      multiple
      :options="languageOptions"
      placeholder="Select languages"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
