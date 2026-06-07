<script setup lang="ts">
import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);
const isLoading = computed(() => context.loading.value);
</script>

<template>
  <span
    data-v1-select-indicator
    :data-open="isOpen"
    :data-loading="isLoading"
    aria-hidden="true"
  >
    <slot :open="isOpen" :loading="isLoading" />
  </span>
</template>
