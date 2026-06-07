<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);
const isLoading = computed(() => context.loading.value);
</script>

<template>
  <span
    data-select-indicator
    :data-open="isOpen"
    :data-loading="isLoading"
    aria-hidden="true"
  >
    <slot :open="isOpen" :loading="isLoading" />
  </span>
</template>
