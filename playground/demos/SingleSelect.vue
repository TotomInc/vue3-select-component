<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { simpleOptions } from "../data/options";

const value = ref<string | null>(null);
</script>

<template>
  <DemoSection
    title="Single select"
    description="Basic single-value selection with placeholder."
  >
    <Select
      v-model="value"
      :options="simpleOptions"
      placeholder="Select an option"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
