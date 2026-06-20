<script setup lang="ts">
import type { SelectOptionData } from "vue3-select-component";

import { computed, ref } from "vue";
import {
  SelectListbox,
  SelectPopover,
  SelectRoot,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import InfiniteScrollOptionList from "../components/InfiniteScrollOptionList.vue";
import { fetchPostsPage, postToSelectOption } from "../utils/jsonplaceholder";

const PAGE_SIZE = 20;

const value = ref<number | null>(null);
const options = ref<SelectOptionData<number>[]>([]);
const totalCount = ref(0);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const fetchError = ref<string | null>(null);

const hasMore = computed(() => options.value.length < totalCount.value);

async function loadPosts(append: boolean) {
  if (append) {
    if (!hasMore.value || isLoadingMore.value) {
      return;
    }

    isLoadingMore.value = true;
  }
  else {
    isLoading.value = true;
  }

  fetchError.value = null;

  try {
    const { posts, total } = await fetchPostsPage({
      start: append ? options.value.length : 0,
      limit: PAGE_SIZE,
    });

    totalCount.value = total;

    const nextOptions = posts.map(postToSelectOption);

    options.value = append ? [...options.value, ...nextOptions] : nextOptions;
  }
  catch (error) {
    fetchError.value = error instanceof Error ? error.message : "Failed to load posts";
  }
  finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
}

function onMenuOpened() {
  if (options.value.length === 0 && !isLoading.value) {
    loadPosts(false);
  }
}
</script>

<template>
  <DemoSection
    title="Infinite scroll primitives"
    description="Load JSONPlaceholder posts page by page. Scroll the menu to fetch the next batch."
  >
    <div data-assembled-select>
      <SelectRoot
        v-model="value"
        :options="options"
        :loading="isLoading"
        @menu-opened="onMenuOpened"
      >
        <SelectTrigger>
          <SelectValue placeholder="Pick a post" />
          <SelectTrailingIcon />
        </SelectTrigger>

        <SelectPopover>
          <SelectListbox class="infinite-scroll-listbox">
            <InfiniteScrollOptionList
              :loaded-count="options.length"
              :total-count="totalCount"
              :is-loading-more="isLoadingMore"
              :has-more="hasMore"
              @load-more="loadPosts(true)"
            />
          </SelectListbox>
        </SelectPopover>
      </SelectRoot>
    </div>

    <p
      v-if="fetchError"
      class="demo-error"
      role="alert"
    >
      {{ fetchError }}
    </p>

    <DemoValue :value="value" />
  </DemoSection>
</template>

<style scoped>
:deep([data-select-listbox].infinite-scroll-listbox) {
  overflow: hidden;
}

.demo-error {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  color: #dc2626;
}
</style>
