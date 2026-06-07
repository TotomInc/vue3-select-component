<script setup lang="ts">
import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

const context = injectSelectContext();

const isVisible = computed(() => context.registeredOptions.value.length === 0);
</script>

<template>
  <div
    v-if="isVisible"
    role="status"
    data-v1-select-no-options
  >
    <slot>No options</slot>
  </div>
</template>
