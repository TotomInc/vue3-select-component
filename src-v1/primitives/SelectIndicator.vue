<script setup lang="ts">
import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);
</script>

<template>
  <span
    data-v1-select-indicator
    :data-open="isOpen"
    aria-hidden="true"
  >
    <slot />
  </span>
</template>
