<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

const options = [
  { label: "Option #1", value: "option_1" },
  { label: "Option #2", value: "option_2" },
  { label: "Option #3", value: "option_3" },
];

const single = ref<string | null>(null);
const multiple = ref<string[]>([]);
</script>

<template>
  <h1>vue3-select-component playground</h1>

  <div class="demo">
    <label>
      Single select
      <Select
        v-model="single"
        :options="options"
        placeholder="Select an option"
      />
    </label>

    <label>
      Multi select
      <Select
        v-model="multiple"
        multiple
        :options="options"
        placeholder="Select options"
      />
    </label>
  </div>
</template>
