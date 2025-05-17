<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

const selected = ref<string | null>(null);

const options: Option<string>[] = [
  { label: "France", value: "FR", countryFlag: "🇫🇷" },
  { label: "Germany", value: "DE", countryFlag: "🇩🇪" },
  { label: "Spain", value: "ES", countryFlag: "🇪🇺" },
  { label: "Italy", value: "IT", countryFlag: "🇮🇹" },
  { label: "United States", value: "US", countryFlag: "🇺🇸" },
  { label: "United Kingdom", value: "GB", countryFlag: "🇬🇧" },
  { label: "Canada", value: "CA", countryFlag: "🇨🇦" },
  { label: "Australia", value: "AU", countryFlag: "🇦🇺" },
  { label: "New Zealand", value: "NZ", countryFlag: "🇳🇿" },
  { label: "Brazil", value: "BR", countryFlag: "🇧🇷" },
  { label: "Argentina", value: "AR", countryFlag: "🇦🇷" },
  { label: "Chile", value: "CL", countryFlag: "🇨🇱" },
];
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="false"
    :is-taggable="true"
    placeholder="Pick a country"
  >
    <template #option="{ option }">
      {{ option.label }} {{ option.countryFlag }} <small>({{ option.value }})</small>
    </template>

    <template #value="{ option }">
      {{ option.label }} {{ option.countryFlag }}
    </template>
  </VueSelect>

  <p class="selected-value">
    Selected country value: {{ selected || "none" }}
  </p>
</template>
