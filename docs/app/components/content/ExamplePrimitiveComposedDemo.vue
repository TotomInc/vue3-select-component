<script setup lang="ts">
import { ref } from "vue";
import {
  SelectClear,
  SelectIcon,
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

import { countryOptions } from "~/utils/demo-options";

const selected = ref<string | null>(null);
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot
      v-model="selected"
      searchable
      clearable
    >
      <SelectTrigger>
        <SelectIcon aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            width="20"
            height="20"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </SelectIcon>
        <SelectValue placeholder="Select a country" />
        <SelectInput />
        <SelectTrailingIcon>
          <template #default="{ open }">
            <span aria-hidden="true">{{ open ? "▲" : "▼" }}</span>
          </template>
        </SelectTrailingIcon>
        <SelectClear />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectNoOptions />
          <SelectOption
            v-for="option in countryOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </SelectListbox>
      </SelectPopover>
    </SelectRoot>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
