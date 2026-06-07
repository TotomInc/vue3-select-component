<script setup lang="ts">
import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

const context = injectSelectContext();

const isMultiple = computed(() => context.multiple.value);
</script>

<template>
  <div
    role="listbox"
    data-v1-select-listbox
    :aria-multiselectable="isMultiple"
  >
    <slot />
  </div>
</template>
