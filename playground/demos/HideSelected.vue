<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { languageOptions } from "../data/options";

const value = ref<string[]>(["js"]);
</script>

<template>
  <DemoSection
    title="Hide selected"
    description="Selected options are removed from the dropdown list but remain as tags in the trigger."
  >
    <Select
      v-model="value"
      multiple
      hide-selected
      :options="languageOptions"
      placeholder="Select languages"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
