<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryOptions } from "../data/options";

const value = ref<string | null>(null);
const searchLog = ref<string[]>([]);

function onSearch(query: string) {
  searchLog.value = [query, ...searchLog.value].slice(0, 8);
}
</script>

<template>
  <DemoSection
    title="Search event"
    description="The search event fires as the user types in searchable mode."
  >
    <Select
      v-model="value"
      searchable
      :options="countryOptions"
      placeholder="Type to search"
      @search="onSearch"
    />
    <DemoValue :value="value" />

    <div v-if="searchLog.length" class="demo-log">
      <p class="demo-log__title">
        Recent search values
      </p>
      <ul>
        <li v-for="(entry, index) in searchLog" :key="index">
          <code>{{ entry }}</code>
        </li>
      </ul>
    </div>
  </DemoSection>
</template>
