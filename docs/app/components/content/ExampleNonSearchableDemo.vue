<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import { simpleOptions } from "~/utils/demo-options";

const selected = ref<string | null>(null);
</script>

<template>
  <div class="select-demo">
    <Select
      v-model="selected"
      :searchable="false"
      :options="simpleOptions"
      placeholder="Select an option"
    />
    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
