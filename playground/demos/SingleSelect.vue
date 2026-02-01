<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoTag from "../components/DemoTag.vue";
import DemoValue from "../components/DemoValue.vue";

const selected = ref<string | null>(null);

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
    <DemoHeader
      eyebrow="Single select"
      title="Create-on-type books"
      description="A minimal single-select with taggable mode enabled, so users can add a new title if it does not exist."
    />

    <DemoPanel>
      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="false"
        :is-taggable="true"
        placeholder="Pick a book"
        @option-created="(value) => handleCreateOption(value)"
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
