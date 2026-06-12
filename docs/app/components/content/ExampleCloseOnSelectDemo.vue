<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import { languageOptions } from "~/utils/demo-options";

const staysOpen = ref<string[]>([]);
const closesOnSelect = ref<string[]>([]);
</script>

<template>
  <div class="select-demo select-demo--stacked">
    <label class="select-demo__field">
      <span class="select-demo__field-label">Default (menu stays open)</span>
      <Select
        v-model="staysOpen"
        multiple
        :options="languageOptions"
        placeholder="Select languages"
      />
    </label>

    <label class="select-demo__field">
      <span class="select-demo__field-label">close-on-select</span>
      <Select
        v-model="closesOnSelect"
        multiple
        close-on-select
        :options="languageOptions"
        placeholder="Select languages"
      />
    </label>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Values</span>
      <code>{{ JSON.stringify({ staysOpen, closesOnSelect }) }}</code>
    </output>
  </div>
</template>
