<script setup lang="ts">
import { ref } from "vue";
import { countries } from "countries-list";

import VueSelect from "../src";

const options = Object.entries(countries).map(([key, value]) => ({ label: value.name, value: key }));

const selectedCountry = ref<string>("FR");
</script>

<template>
  <div class="max-w-sm w-full relative mx-auto mt-8">
    <h2 class="text-xl font-medium text-neutral-900 mb-2">
      Custom option & menu with default value
    </h2>

    <p class="mb-0.5 text-sm font-medium text-neutral-900">
      Country
    </p>

    <VueSelect
      v-model="selectedCountry"
      :options="options"
      placeholder="Select a country"
    >
      <template #value="{ option }">
        <div class="flex items-center gap-1.5">
          <img :src="`https://flagsapi.com/${option.value}/flat/24.png`" class="block w-6 h-auto">
          <span class="text-base font-medium text-neutral-900">{{ option.label }}</span>
        </div>
      </template>

      <template #option="{ option }">
        <p class="flex items-center gap-1 text-neutral-900 font-medium">
          {{ option.label }} <small class="text-sm text-neutral-600 font-medium">{{ option.value }}</small>
        </p>
      </template>
    </VueSelect>

    <p class="mt-1 text-sm text-neutral-700">
      Ref value: <span class="font-medium">{{ selectedCountry || "empty" }}</span>
    </p>
  </div>
</template>
