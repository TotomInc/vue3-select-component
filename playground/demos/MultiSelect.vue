<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

const selected = ref<number[]>([]);

const options: Option<number>[] = [
  { label: "Alice", value: 1 },
  { label: "Bob", value: 2 },
  { label: "Charlie", value: 3 },
  { label: "David", value: 4 },
];
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="true"
    placeholder="Select users"
  />

  <p class="selected-value">
    Selected users: {{ selected || "none" }}
  </p>
</template>
