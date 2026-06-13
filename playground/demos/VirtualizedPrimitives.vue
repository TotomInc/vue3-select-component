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

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import VirtualizedOptionList from "../components/VirtualizedOptionList.vue";

const OPTION_COUNT = 50_000;

const allOptions: SelectOptionData[] = Array.from({ length: OPTION_COUNT }, (_, index) => {
  const id = index + 1;

  return {
    label: `Option ${id.toLocaleString()}`,
    value: String(id),
  };
});

const value = ref<string | null>(null);
</script>

<template>
  <DemoSection
    title="Virtualized primitives"
    description="Register 50,000 options on SelectRoot, then render only visible rows with VueUse useVirtualList. Keyboard navigation and search still work across the full list."
  >
    <div data-assembled-select>
      <SelectRoot
        v-model="value"
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
    </div>

    <DemoValue :value="value" />
  </DemoSection>
</template>

<style scoped>
:deep([data-select-listbox].virtualized-listbox) {
  overflow: hidden;
}
</style>
