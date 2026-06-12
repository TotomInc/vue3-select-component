<script setup lang="ts">
import { ref } from "vue";
import {
  SelectGroup,
  SelectGroupLabel,
  SelectListbox,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectSeparator,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

const selected = ref<string | null>(null);

const frequentOptions = [
  { label: "France", value: "FR" },
  { label: "Japan", value: "JP" },
];

const otherOptions = [
  { label: "Brazil", value: "BR" },
  { label: "Canada", value: "CA" },
];
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot v-model="selected" :searchable="false">
      <SelectTrigger>
        <SelectValue placeholder="Pick a country" />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectGroup>
            <SelectGroupLabel>Frequent</SelectGroupLabel>
            <SelectOption
              v-for="option in frequentOptions"
              :key="option.value"
              v-bind="option"
            />
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectGroupLabel>Other countries</SelectGroupLabel>
            <SelectOption
              v-for="option in otherOptions"
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
