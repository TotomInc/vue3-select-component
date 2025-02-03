<script setup lang="ts">
import type { Option } from "../../src/types";
import { ref } from "vue";
import VueSelect from "../../src/Select.vue";

const selected = ref<string[]>([]);

const options = ref<Option<string>[]>([
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
]);

const handleCreateOption = (value: string) => {
  options.value.push({ label: value, value });
  selected.value.push(value);
};
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="true"
    :is-taggable="true"
    placeholder="Select programming languages"
    @option-created="(value) => handleCreateOption(value)"
  />

  <p class="selected-value">
    Selected programming languages: {{ selected || "none" }}
  </p>
</template>
