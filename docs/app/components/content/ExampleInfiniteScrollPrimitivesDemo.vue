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

import { fetchPostsPage, postToSelectOption } from "~/utils/jsonplaceholder";
import InfiniteScrollOptionList from "./InfiniteScrollOptionList.vue";

const PAGE_SIZE = 20;

const selected = ref<number | null>(null);
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
  <div data-assembled-select class="select-demo">
    <SelectRoot
      v-model="selected"
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

    <p
      v-if="fetchError"
      class="select-demo__error"
      role="alert"
    >
      {{ fetchError }}
    </p>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>

<style scoped>
:deep([data-select-listbox].infinite-scroll-listbox) {
  overflow: hidden;
}

.select-demo__error {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  color: #dc2626;
}
</style>
