<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

const selected = ref<string | null>(null);
const isMenuOpen = ref(false);

const options: Option<string>[] = [
  { label: "Alice's Adventures in Wonderland", value: "alice" },
  { label: "A Wizard of Earthsea", value: "wizard" },
  { label: "Harry Potter and the Philosopher's Stone", value: "harry_potter_1" },
  { label: "Harry Potter and the Chamber of Secrets", value: "harry_potter_2" },
];

const handleOpenMenu = () => {
  if (!isMenuOpen.value) {
    isMenuOpen.value = true;
  }
};
</script>

<template>
  <button type="button" @click="handleOpenMenu">
    Toggle menu ({{ isMenuOpen ? "opened" : "closed" }})
  </button>

  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="false"
    :is-menu-open="isMenuOpen"
    placeholder="Pick a book"
    @menu-opened="isMenuOpen = true"
    @menu-closed="isMenuOpen = false"
  />

  <p class="selected-value">
    Selected book value: {{ selected || "none" }}
  </p>
</template>
