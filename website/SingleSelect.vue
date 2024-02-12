<script setup lang="ts">
import { ref } from "vue";
import { countries } from "countries-list";

import VueSelect from "../src";

const options = Object.entries(countries).map(([key, value]) => ({ label: value.name, value: key }));

const selectedCountry = ref<string>("");
</script>

<template>
  <div class="max-w-sm w-full relative mx-auto mt-8">
    <h2 class="text-xl font-medium text-neutral-900 mb-2">
      Single-select
    </h2>

    <p class="mb-0.5 text-sm font-medium text-neutral-900">
      Country
    </p>

    <VueSelect
      v-model="selectedCountry"
      :options="options"
      placeholder="Select a country"
    />

    <p class="mt-1 text-sm text-neutral-700">
      Ref value: <span class="font-medium">{{ selectedCountry || "empty" }}</span>
    </p>
  </div>
</template>
