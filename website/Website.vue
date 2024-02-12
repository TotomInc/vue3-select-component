<script setup lang="ts">
import MultiSelect from "./MultiSelect.vue";
import SingleSelect from "./SingleSelect.vue";
import CustomOption from "./CustomOption.vue";
</script>

<template>
  <main class="min-h-screen flex flex-col items-center pt-8 font-sans bg-neutral-100">
    <h1 class="text-center text-neutral-950 font-medium text-3xl">
      Vue3-Select-Component
    </h1>

    <p class="text-center text-neutral-700 text-lg mt-4">
      A flexible & modern select-input control for Vue 3.
    </p>

    <a
      href="https://github.com/TotomInc/vue3-select-component"
      target="_blank"
      class="mt-4 border border-neutral-200 bg-white rounded text-sm font-medium px-4 py-2 text-neutral-950 flex items-center self-start mx-auto hover:bg-neutral-50 focus:outline-none gap-1.5"
    >
      View docs on GitHub
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="w-5 h-auto"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>

    <MultiSelect />
    <SingleSelect />
    <CustomOption />

    <p class="text-center text-neutral-700 text-sm font-medium mt-4">
      Take a look at the GitHub repository for the complete documentation.
    </p>
  </main>
</template>
