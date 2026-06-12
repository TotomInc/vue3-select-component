<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { languageOptions } from "../data/options";

const staysOpen = ref<string[]>([]);
const closesOnSelect = ref<string[]>([]);
</script>

<template>
  <DemoSection
    title="Close on select"
    description="Override the default multi-select behavior. null closes on single-select only; true/false force the menu to close or stay open."
  >
    <label class="demo-field">
      Default (menu stays open)
      <Select
        v-model="staysOpen"
        multiple
        :options="languageOptions"
        placeholder="Select languages"
      />
      <DemoValue label="Value" :value="staysOpen" />
    </label>

    <label class="demo-field">
      close-on-select
      <Select
        v-model="closesOnSelect"
        multiple
        close-on-select
        :options="languageOptions"
        placeholder="Select languages"
      />
      <DemoValue label="Value" :value="closesOnSelect" />
    </label>
  </DemoSection>
</template>
