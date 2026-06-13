<script setup lang="ts">
import type { SelectOptionData } from "vue3-select-component";

import { ref } from "vue";
import {
  SelectInput,
  SelectListbox,
  SelectPopover,
  SelectRoot,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

import VirtualizedOptionList from "./VirtualizedOptionList.vue";

const OPTION_COUNT = 50_000;

const allOptions: SelectOptionData[] = Array.from({ length: OPTION_COUNT }, (_, index) => {
  const id = index + 1;

  return {
    label: `Option ${id.toLocaleString()}`,
    value: String(id),
  };
});

const selected = ref<string | null>(null);
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot
      v-model="selected"
      :options="allOptions"
      searchable
    >
      <SelectTrigger>
        <SelectValue placeholder="Pick from 50,000 options" />
        <SelectInput />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover :teleport="false">
        <SelectListbox class="virtualized-listbox">
          <VirtualizedOptionList :total-count="OPTION_COUNT" />
        </SelectListbox>
      </SelectPopover>
    </SelectRoot>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>

<style scoped>
:deep([data-select-listbox].virtualized-listbox) {
  overflow: hidden;
}
</style>
