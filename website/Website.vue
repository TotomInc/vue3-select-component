<script setup lang="ts">
import GitHubLink from "./GitHubLink.vue";
import MultiSelect from "./MultiSelect.vue";
import SingleSelect from "./SingleSelect.vue";
import CustomOption from "./CustomOption.vue";
</script>

<template>
  <main class="flex flex-col items-center pt-8">
    <h1 class="text-center text-neutral-950 font-medium text-3xl">
      Vue3-Select-Component
    </h1>

    <p class="text-center text-neutral-700 text-lg mt-4">
      A flexible & modern select-input control for Vue 3.
    </p>

    <ul class="mt-4 font-medium text-sm text-neutral-700">
      <li>- Single & multi-select</li>
      <li>- Data manipulation with v-model</li>
      <li>- Easy to customize (CSS variables & :deep selector)</li>
      <li>- Custom slots provided</li>
      <li>- Teleport the menu to handle z-index edge-cases</li>
      <li>- No dependencies, ultra light-weight (3kb with gzip)</li>
    </ul>

    <GitHubLink class="mt-4" />

    <MultiSelect />
    <SingleSelect />
    <CustomOption />
  </main>
</template>
