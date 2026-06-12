<script setup lang="ts">
import { ref } from "vue";
import {
  SelectListbox,
  SelectNoOptions,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

import { simpleOptions } from "~/utils/demo-options";

const selected = ref<string | null>(null);
const side = ref<"top" | "right" | "bottom" | "left">("top");
const align = ref<"start" | "center" | "end">("end");
</script>

<template>
  <div data-assembled-select class="select-demo">
    <div class="select-demo__controls">
      <label class="select-demo__control">
        Side
        <select v-model="side">
          <option value="top">
            top
          </option>
          <option value="right">
            right
          </option>
          <option value="bottom">
            bottom
          </option>
          <option value="left">
            left
          </option>
        </select>
      </label>

      <label class="select-demo__control">
        Align
        <select v-model="align">
          <option value="start">
            start
          </option>
          <option value="center">
            center
          </option>
          <option value="end">
            end
          </option>
        </select>
      </label>
    </div>

    <SelectRoot v-model="selected" :searchable="false">
      <SelectTrigger>
        <SelectValue placeholder="Open to inspect placement" />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover
        :side="side"
        :align="align"
        :side-offset="8"
      >
        <SelectListbox>
          <SelectNoOptions />
          <SelectOption
            v-for="option in simpleOptions"
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
