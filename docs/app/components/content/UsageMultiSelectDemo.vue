<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

const selected = ref<string[]>([]);

const options = [
  { label: "Option #1", value: "option_1" },
  { label: "Option #2", value: "option_2" },
  { label: "Option #3", value: "option_3" },
];
</script>

<template>
  <div class="select-demo">
    <Select
      v-model="selected"
      multiple
      :options="options"
      placeholder="Select options"
    />
    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
