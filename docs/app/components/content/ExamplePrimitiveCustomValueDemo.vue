<script setup lang="ts">
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

import { languageOptions } from "~/utils/demo-options";

const selected = ref<string | null>("ts");
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot v-model="selected" searchable>
      <SelectTrigger>
        <SelectValue placeholder="Pick a language">
          <template #default="{ selectedOptions }">
            <span v-if="selectedOptions[0]">
              Selected: {{ selectedOptions[0].label }}
            </span>
          </template>
        </SelectValue>
        <SelectInput />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectNoOptions />
          <SelectOption
            v-for="option in languageOptions"
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
