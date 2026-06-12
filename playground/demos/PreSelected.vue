<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryOptions, languageOptions } from "../data/options";

const single = ref<string | null>("GB");
const multiple = ref<string[]>(["js", "ts"]);
</script>

<template>
  <DemoSection
    title="Pre-selected"
    description="Initial v-model values render the matching option labels."
  >
    <label class="demo-field">
      Single
      <Select
        v-model="single"
        :options="countryOptions"
        placeholder="Select a country"
      />
      <DemoValue label="Single value" :value="single" />
    </label>

    <label class="demo-field">
      Multi
      <Select
        v-model="multiple"
        multiple
        :options="languageOptions"
        placeholder="Select languages"
      />
      <DemoValue label="Multi value" :value="multiple" />
    </label>
  </DemoSection>
</template>
