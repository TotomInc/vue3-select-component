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

import { languageOptionsWithMeta } from "~/utils/demo-options";

const selected = ref<string | null>(null);
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot v-model="selected" searchable>
      <SelectTrigger>
        <SelectValue placeholder="Pick a language" />
        <SelectInput />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectNoOptions />
          <SelectOption
            v-for="option in languageOptionsWithMeta"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
            <span class="select-primitive-option">
              <span class="select-primitive-option__label">{{ option.label }}</span>
              <span class="select-primitive-option__meta">{{ option.description }}</span>
            </span>
          </SelectOption>
        </SelectListbox>
      </SelectPopover>
    </SelectRoot>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
