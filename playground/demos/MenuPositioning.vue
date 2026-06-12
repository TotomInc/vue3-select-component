<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { simpleOptions } from "../data/options";

const value = ref<string | null>(null);
const side = ref<"top" | "right" | "bottom" | "left">("top");
const align = ref<"start" | "center" | "end">("end");
</script>

<template>
  <DemoSection
    title="Menu positioning"
    description="Popover placement via side and align props."
  >
    <div class="demo-controls">
      <label class="demo-control">
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

      <label class="demo-control">
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

    <Select
      v-model="value"
      :side="side"
      :align="align"
      :side-offset="8"
      :options="simpleOptions"
      placeholder="Open to inspect placement"
    />
    <DemoValue :value="value" />
  </DemoSection>
</template>
