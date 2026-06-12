<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import { countryOptions } from "~/utils/demo-options";

const nonSearchable = ref<string | null>(null);
const clearable = ref<string | null>("FR");
</script>

<template>
  <div class="select-demo">
    <label class="select-demo__field">
      <span class="select-demo__field-label">Non-searchable</span>
      <Select
        v-model="nonSearchable"
        :searchable="false"
        :options="countryOptions"
        placeholder="Pick a country"
      />
    </label>

    <label class="select-demo__field">
      <span class="select-demo__field-label">Clearable</span>
      <Select
        v-model="clearable"
        clearable
        :options="countryOptions"
        placeholder="Search and select"
      />
    </label>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Values</span>
      <code>{{ JSON.stringify({ nonSearchable, clearable }) }}</code>
    </output>
  </div>
</template>
