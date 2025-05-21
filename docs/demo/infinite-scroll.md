---
title: 'Infinite Scroll'
---

# Infinite Scroll

Due to VitePress restriction, it's not possible to show the infinite scroll demo here.

Please refer to the [demo component source-code](https://github.com/TotomInc/vue3-select-component/blob/8241306c7ddcb9840ea55ffbea9e45b59b80fbdc/playground/demos/InfiniteScroll.vue).

```vue
<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

// Track the selected value
const selected = ref<string | null>(null);

// Track loading state when fetching more options
const isLoading = ref(false);

// Track current page for pagination
const currentPage = ref(1);

// Store all available options
const options = ref<Option<string>[]>([]);

// Simulate an API call to fetch more books
const fetchMoreBooks = async (page: number) => {
  isLoading.value = true;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate 10 new books for each page
  const newBooks = Array.from({ length: 10 }, (_, i) => {
    const bookNumber = (page - 1) * 10 + i + 1;
    return {
      label: `Book #${bookNumber}`,
      value: `book_${bookNumber}`,
    };
  });

  options.value = [...options.value, ...newBooks];
  currentPage.value = page;
  isLoading.value = false;
};

// Handle scroll event in the menu container
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;

  if (isAtBottom && !isLoading.value) {
    fetchMoreBooks(currentPage.value + 1);
  }
};

// Load initial data
fetchMoreBooks(1);
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="false"
    placeholder="Pick a book"
    :classes="{ menuContainer: 'custom-menu-container' }"
  >
    <template #menu-container="{ defaultContent }">
      <div
        class="infinite-scroll-container"
        @scroll="handleScroll"
      >
        <component :is="defaultContent" />

        <div v-if="isLoading" class="loading-indicator">
          Loading more books...
        </div>
      </div>
    </template>
  </VueSelect>

  <p class="selected-value">
    Selected book value: {{ selected || "none" }}
  </p>
</template>

<style scoped>
:deep(.custom-menu-container) {
  max-height: 202px;
}

.infinite-scroll-container {
  max-height: 200px;
  overflow-y: auto;
}

.loading-indicator {
  text-align: center;
  padding: 8px;
  font-size: 14px;
  color: #666;
}
</style>
```
