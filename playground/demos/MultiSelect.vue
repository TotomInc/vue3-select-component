<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoValue from "../components/DemoValue.vue";

const selected = ref<number[]>([]);

const options: Option<number>[] = [
  { label: "Alice", value: 1 },
  { label: "Bob", value: 2 },
  { label: "Charlie", value: 3 },
  { label: "David", value: 4 },
];
</script>

<template>
  <DemoLayout>
    <DemoHeader eyebrow="Multi-select" title="Select multiple users">
      <template #description>
        Enable <DemoInlineCode>is-multi</DemoInlineCode> to collect multiple values while keeping a single input.
      </template>
    </DemoHeader>

    <DemoPanel>
      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="true"
        placeholder="Select users"
      />

      <DemoValue label="Selected users">
        {{ selected.length ? selected : "none" }}
      </DemoValue>
    </DemoPanel>
  </DemoLayout>
</template>
