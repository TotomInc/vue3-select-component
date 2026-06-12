<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import { languageOptions } from "~/utils/demo-options";

const selected = ref<string[]>(["js"]);
</script>

<template>
  <div class="select-demo">
    <Select
      v-model="selected"
      multiple
      hide-selected
      :options="languageOptions"
      placeholder="Select languages"
    />
    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
