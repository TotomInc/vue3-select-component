<script setup lang="ts">
import { ref } from "vue";
import {
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectListbox,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectSeparator,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";

const value = ref<string | null>(null);

const frontendOptions = [
  { label: "Vue", value: "vue" },
  { label: "React", value: "react" },
  { label: "Svelte", value: "svelte" },
];

const backendOptions = [
  { label: "Node.js", value: "node" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
];
</script>

<template>
  <DemoSection
    title="Grouped primitives"
    description="Group labels and separators structure the list without becoming selectable options."
  >
    <div data-assembled-select>
      <SelectRoot v-model="value" searchable>
        <SelectTrigger>
          <SelectValue placeholder="Pick a technology" />
          <SelectInput />
          <SelectTrailingIcon />
        </SelectTrigger>

        <SelectPopover>
          <SelectListbox>
            <SelectGroup>
              <SelectGroupLabel>Frontend</SelectGroupLabel>
              <SelectOption
                v-for="option in frontendOptions"
                :key="option.value"
                v-bind="option"
              />
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectGroupLabel>Backend</SelectGroupLabel>
              <SelectOption
                v-for="option in backendOptions"
                :key="option.value"
                v-bind="option"
              />
            </SelectGroup>
          </SelectListbox>
        </SelectPopover>
      </SelectRoot>
    </div>

    <DemoValue :value="value" />
  </DemoSection>
</template>
