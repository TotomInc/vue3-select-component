<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

const context = injectSelectContext();

const isVisible = computed(() =>
  context.filteredOptions.value.length === 0 && !context.showCreateItem.value,
);
const searchValue = computed(() => context.searchValue.value);
</script>

<template>
  <div
    v-if="isVisible"
    role="status"
    data-select-no-options
  >
    <slot :search-value="searchValue">
      No options
    </slot>
  </div>
</template>
