<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoValue from "../components/DemoValue.vue";

const selected = ref<string[]>([]);

const options = ref<Option<string>[]>([
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
]);

const handleCreateOption = (value: string) => {
  options.value.push({ label: value, value });
  selected.value.push(value);
};
</script>

<template>
  <DemoLayout>
    <DemoHeader eyebrow="Taggable" title="Add multiple custom values">
      <template #description>
        Combine <DemoInlineCode>is-multi</DemoInlineCode> with <DemoInlineCode>is-taggable</DemoInlineCode> to let
        teams capture new skills while selecting existing ones.
      </template>
    </DemoHeader>

    <DemoPanel>
      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="true"
        :is-taggable="true"
        placeholder="Select programming languages"
        @option-created="(value) => handleCreateOption(value)"
      />

      <DemoValue label="Selected programming languages">
        {{ selected.length ? selected : "none" }}
      </DemoValue>
    </DemoPanel>
  </DemoLayout>
</template>
