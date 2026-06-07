<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

const context = injectSelectContext();

const isVisible = computed(() => context.filteredOptions.value.length === 0);
</script>

<template>
  <div
    v-if="isVisible"
    role="status"
    data-select-no-options
  >
    <slot>No options</slot>
  </div>
</template>
