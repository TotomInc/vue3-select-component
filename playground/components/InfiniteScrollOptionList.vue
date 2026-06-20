<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { computed, useTemplateRef } from "vue";
import {
  injectSelectContext,
  SelectNoOptions,
  SelectOption,
} from "vue3-select-component/primitives";

const props = defineProps<{
  loadedCount: number;
  totalCount: number;
  isLoadingMore: boolean;
  hasMore: boolean;
}>();

const emit = defineEmits<{
  loadMore: [];
}>();

const context = injectSelectContext<number>();
const scrollContainer = useTemplateRef<HTMLElement>("scrollContainer");

const filteredOptions = computed(() => [...context.filteredOptions.value]);

useInfiniteScroll(
  scrollContainer,
  () => emit("loadMore"),
  {
    distance: 48,
    canLoadMore: () => props.hasMore && !props.isLoadingMore,
  },
);
</script>

<template>
  <SelectNoOptions />

  <div
    ref="scrollContainer"
    class="infinite-scroll-option-list"
  >
    <SelectOption
      v-for="option in filteredOptions"
      :key="String(option.value)"
      :value="option.value"
      :label="option.label"
      :disabled="option.disabled"
    />

    <p
      v-if="isLoadingMore"
      class="infinite-scroll-option-list__status"
      role="status"
    >
      Loading more…
    </p>

    <p
      v-else-if="!hasMore && loadedCount > 0"
      class="infinite-scroll-option-list__status"
    >
      All {{ totalCount }} posts loaded.
    </p>
  </div>

  <p class="infinite-scroll-option-list__stats">
    {{ loadedCount }} of {{ totalCount }} posts loaded.
  </p>
</template>

<style scoped>
.infinite-scroll-option-list {
  height: var(--vs-menu-height, 200px);
  overflow: auto;
}

.infinite-scroll-option-list__status,
.infinite-scroll-option-list__stats {
  margin: 0;
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: #71717a;
}

.infinite-scroll-option-list__stats {
  padding-top: 0;
}
</style>
