<script setup lang="ts">
import type { Option } from "../../src/types";
import { ref } from "vue";
import VueSelect from "../../src/Select.vue";

const isLoading = ref(false);
const selected = ref<string | null>(null);

const options: Option<string>[] = [
  { label: "Alice's Adventures in Wonderland", value: "alice" },
  { label: "A Wizard of Earthsea", value: "wizard" },
  { label: "Harry Potter and the Philosopher's Stone", value: "harry_potter_1" },
  { label: "Harry Potter and the Chamber of Secrets", value: "harry_potter_2" },
];
</script>

<template>
  <button type="button" @click="isLoading = !isLoading">
    Toggle isLoading
  </button>

  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="false"
    :is-loading="isLoading"
    placeholder="Pick a book"
  />

  <p class="selected-value">
    Selected book value: {{ selected || "none" }}
  </p>
</template>
