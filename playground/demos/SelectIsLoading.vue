<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoValue from "../components/DemoValue.vue";

const isLoading = ref(false);
const selected = ref<string | null>(null);

const options: Option<string>[] = [
  { label: "Alice's Adventures in Wonderland", value: "alice" },
  { label: "A Wizard of Earthsea", value: "wizard" },
  { label: "Harry Potter and the Philosopher's Stone", value: "harry_potter_1" },
  { label: "Harry Potter and the Chamber of Secrets", value: "harry_potter_2" },
];
</script>

<template>
  <DemoLayout>
    <DemoHeader eyebrow="Loading state" title="Async loading">
      <template #description>
        Toggle <DemoInlineCode>is-loading</DemoInlineCode> to show the spinner while options are fetched.
      </template>
    </DemoHeader>

    <DemoPanel>
      <button
        type="button"
        class="w-fit rounded-xl border border-[color:rgba(34,211,238,0.5)] bg-[color:rgba(34,211,238,0.16)] px-4 py-2 text-sm font-medium text-[color:var(--playground-text-strong)] transition hover:bg-[color:rgba(34,211,238,0.24)]"
        @click="isLoading = !isLoading"
      >
        Toggle isLoading
      </button>

      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="false"
        :is-loading="isLoading"
        placeholder="Pick a book"
      />

      <DemoValue label="Selected book value">
        {{ selected || "none" }}
      </DemoValue>
    </DemoPanel>
  </DemoLayout>
</template>
