<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoTag from "../components/DemoTag.vue";
import DemoValue from "../components/DemoValue.vue";

const selected = ref<string | null>(null);
const search = ref<string | null>(null);

const options = ref<Option<string>[]>([
  { label: "Alice's Adventures in Wonderland", value: "alice" },
  { label: "A Wizard of Earthsea", value: "wizard" },
  { label: "Harry Potter and the Philosopher's Stone", value: "harry_potter_1" },
  { label: "Harry Potter and the Chamber of Secrets", value: "harry_potter_2" },
]);

const handleCreateOption = (value: string) => {
  options.value.push({ label: value, value });
  selected.value = value;
};
</script>

<template>
  <DemoLayout>
    <DemoHeader eyebrow="Events" title="Search input updates">
      <template #description>
        Listen to the <DemoInlineCode>search</DemoInlineCode> event to track the live query and drive analytics
        or remote suggestions.
      </template>
    </DemoHeader>

    <DemoPanel>
      <DemoValue label="Search text">
        {{ search || "none" }}
      </DemoValue>

      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="false"
        :is-taggable="true"
        placeholder="Pick a book"
        @option-created="(value) => handleCreateOption(value)"
        @search="(value) => search = value"
      >
        <template #taggable-no-options="{ option }">
          <DemoTag>Create option: {{ option }}</DemoTag>
        </template>
      </VueSelect>

      <DemoValue label="Selected book value">
        {{ selected || "none" }}
      </DemoValue>
    </DemoPanel>
  </DemoLayout>
</template>
