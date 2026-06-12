<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);
const isLoading = computed(() => context.loading.value);
</script>

<template>
  <span
    data-select-trailing-icon
    :data-open="isOpen"
    :data-loading="isLoading"
    aria-hidden="true"
  >
    <slot :open="isOpen" :loading="isLoading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        width="1em"
        height="1em"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    </slot>
  </span>
</template>
