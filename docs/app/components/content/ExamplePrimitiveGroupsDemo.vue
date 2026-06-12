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
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

const selected = ref<string | null>(null);

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
  <div data-assembled-select class="select-demo">
    <SelectRoot v-model="selected" searchable>
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

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
