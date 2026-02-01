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
    <DemoHeader eyebrow="Behavior" title="Disable select-on-blur">
      <template #description>
        When <DemoInlineCode>select-on-blur</DemoInlineCode> is false, users must explicitly confirm a choice.
      </template>
    </DemoHeader>

    <DemoPanel>
      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="false"
        :is-taggable="true"
        :select-on-blur="false"
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
