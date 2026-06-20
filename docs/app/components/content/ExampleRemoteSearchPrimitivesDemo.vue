<script setup lang="ts">
import type { SelectOptionData } from "vue3-select-component";

import { useDebounceFn } from "@vueuse/core";
import { ref } from "vue";
import {
  SelectInput,
  SelectListbox,
  SelectNoOptions,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

import { postToSelectOption, searchPosts } from "~/utils/jsonplaceholder";

const selected = ref<number | null>(null);
const options = ref<SelectOptionData<number>[]>([]);
const isLoading = ref(false);
const fetchError = ref<string | null>(null);
const resultCount = ref(0);

let activeRequestId = 0;

function passThroughFilter() {
  return true;
}

async function fetchRemoteOptions(query: string) {
  const requestId = ++activeRequestId;

  isLoading.value = true;
  fetchError.value = null;

  try {
    const posts = await searchPosts({ query });

    if (requestId !== activeRequestId) {
      return;
    }

    options.value = posts.map(postToSelectOption);
    resultCount.value = posts.length;
  }
  catch (error) {
    if (requestId !== activeRequestId) {
      return;
    }

    fetchError.value = error instanceof Error ? error.message : "Failed to search posts";
    options.value = [];
    resultCount.value = 0;
  }
  finally {
    if (requestId === activeRequestId) {
      isLoading.value = false;
    }
  }
}

const onSearchDebounced = useDebounceFn(fetchRemoteOptions, 300);

function onMenuOpened() {
  if (options.value.length === 0 && !isLoading.value) {
    fetchRemoteOptions("");
  }
}
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot
      v-model="selected"
      :options="options"
      searchable
      :loading="isLoading"
      :filter-by="passThroughFilter"
      @search="onSearchDebounced"
      @menu-opened="onMenuOpened"
    >
      <SelectTrigger>
        <SelectValue placeholder="Search posts by title" />
        <SelectInput />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectNoOptions>
            <template #default="{ searchValue }">
              {{ isLoading ? "Searching…" : `No posts match "${searchValue}"` }}
            </template>
          </SelectNoOptions>

          <SelectOption
            v-for="option in options"
            :key="String(option.value)"
            :value="option.value"
            :label="option.label"
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

    <p v-else-if="resultCount > 0" class="select-demo__stats">
      {{ resultCount }} posts from JSONPlaceholder.
    </p>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>

<style scoped>
.select-demo__error {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  color: #dc2626;
}

.select-demo__stats {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: #71717a;
}
</style>
