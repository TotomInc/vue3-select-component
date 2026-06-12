<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import { countryOptions } from "~/utils/demo-options";

const selected = ref<string | null>("FR");
</script>

<template>
  <div class="select-demo">
    <Select
      v-model="selected"
      clearable
      :options="countryOptions"
      placeholder="Select a country"
    />
    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
