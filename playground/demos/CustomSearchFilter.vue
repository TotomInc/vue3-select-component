<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

type BookOption = Option<string> & {
  year: number;
  author: string;
};

const selected = ref<string | null>(null);

const options: BookOption[] = [
  { value: "1984", label: "1984", year: 1949, author: "George Orwell" },
  { value: "brave-new-world", label: "Brave New World", year: 1932, author: "Aldous Huxley" },
  { value: "fahrenheit-451", label: "Fahrenheit 451", year: 1953, author: "Ray Bradbury" },
  { value: "dune", label: "Dune", year: 1965, author: "Frank Herbert" },
  { value: "neuromancer", label: "Neuromancer", year: 1984, author: "William Gibson" },
];

const customSearchFilter = (option: BookOption, label: string, search: string) => {
  return option.year.toString().includes(search)
    || option.author.toLowerCase().includes(search.toLowerCase())
    || label.toLowerCase().includes(search.toLowerCase());
};
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="false"
    :filter-by="customSearchFilter"
    placeholder="Pick a book"
  >
    <template #option="{ option }">
      <b>{{ option.label }}</b> by {{ option.author }} <small>{{ option.year }}</small>
    </template>

    <template #value="{ option }">
      <b>{{ option.label }}</b>&nbsp;<small>{{ option.year }}</small>
    </template>
  </VueSelect>

  <p class="selected-value">
    Selected book value: {{ selected || "none" }}
  </p>
</template>
