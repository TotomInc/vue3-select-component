<script setup lang="ts">
import type { Option } from "../src";
import { ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import Select from "../src";

const links = [
  { value: "/single-select", label: "Single Select" },
  { value: "/multi-select", label: "Multi Select" },
  { value: "/multi-select-taggable", label: "Multi Select Taggable" },
  { value: "/custom-placeholder", label: "Custom Placeholder" },
  { value: "/custom-tag-content", label: "Custom Tag Content" },
  { value: "/extra-option-properties", label: "Extra Option Properties" },
  { value: "/custom-option-label-value", label: "Custom Option Label/Value" },
  { value: "/custom-search-filter", label: "Custom Search Filter" },
  { value: "/select-is-loading", label: "Select isLoading" },
  { value: "/taggable-no-options-slot", label: "Taggable No Options Slot" },
  { value: "/controlled-menu", label: "Controlled Menu" },
  { value: "/menu-header", label: "Menu Header" },
];

const router = useRouter();

const activeLink = ref<string | null>(links[0].value);

const handleNavigation = (option: Option<string>) => {
  router.push(option.value);
};
</script>

<template>
  <div class="navigation-container">
    <Select
      v-model="activeLink"
      :options="links"
      placeholder="Select a demo"
      @option-selected="handleNavigation"
    />
  </div>

  <div class="container">
    <form class="form-container" @submit.prevent="null">
      <RouterView />
    </form>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300..900&display=swap');

body {
  -webkit-font-smoothing: antialiased;
  margin: 0;
  font-family: "Inter", sans-serif;
  background-color: #f4f4f5;
}
</style>

<style lang="css" scoped>
.navigation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto 0;
  max-width: 400px;
}

.container {
  padding: 2rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  padding: 2rem;
  margin: 0 auto;
  border-radius: 6px;
  background-color: #fff;
}

.selected-value {
  font-size: 14px;
  font-weight: 500;
  font-family: "IBM Plex Mono", monospace;
}
</style>
