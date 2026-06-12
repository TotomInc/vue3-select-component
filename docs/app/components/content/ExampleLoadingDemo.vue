<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import { countryOptions } from "~/utils/demo-options";

const selected = ref<string | null>(null);
const loading = ref(true);
</script>

<template>
  <div class="select-demo">
    <label class="select-demo__toggle">
      <input v-model="loading" type="checkbox">
      Loading
    </label>

    <Select
      v-model="selected"
      :loading="loading"
      :options="countryOptions"
      placeholder="Select a country"
    />
    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
