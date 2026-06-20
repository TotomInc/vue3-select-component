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

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { postToSelectOption, searchPosts } from "../utils/jsonplaceholder";

const value = ref<number | null>(null);
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
  <DemoSection
    title="Remote search primitives"
    description="Debounce the search event and query JSONPlaceholder with title_like. Options come from the API, not local filtering."
  >
    <div data-assembled-select>
      <SelectRoot
        v-model="value"
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
    </div>

    <p
      v-if="fetchError"
      class="demo-error"
      role="alert"
    >
      {{ fetchError }}
    </p>

    <p v-else-if="resultCount > 0" class="demo-stats">
      {{ resultCount }} posts from JSONPlaceholder.
    </p>

    <DemoValue :value="value" />
  </DemoSection>
</template>

<style scoped>
.demo-error {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  color: #dc2626;
}

.demo-stats {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: #71717a;
}
</style>
