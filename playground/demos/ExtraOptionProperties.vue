<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoValue from "../components/DemoValue.vue";

type BookOption = Option<string> & {
  year: number;
  author: string;
};

const selected = ref<string | null>(null);

const options: BookOption[] = [
  { value: "1984", label: "1984", year: 1949, author: "George Orwell" },
  { value: "brave-new-world", label: "Brave New World", year: 1932, author: "Aldous Huxley" },
  { value: "fahrenheit-451", label: "Fahrenheit 451", year: 1953, author: "Ray Bradbury" },
  { value: "dune", label: "Dune", year: 1965, author: "Frank Herbert" },
  { value: "neuromancer", label: "Neuromancer", year: 1984, author: "William Gibson" },
];
</script>

<template>
  <DemoLayout>
    <DemoHeader
      eyebrow="Option metadata"
      title="Display extra fields"
      description="Options can carry extra properties like author and year. Use slots to surface that context in the menu and selected value."
    />

    <DemoPanel>
      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="false"
        placeholder="Pick a book"
      >
        <template #option="{ option }">
          <span class="font-semibold text-[color:var(--playground-text-strong)]">{{ option.label }}</span>
          <span class="text-[color:var(--playground-muted)]"> by {{ option.author }}</span>
          <span class="text-[color:var(--playground-muted)]"> · {{ option.year }}</span>
        </template>

        <template #value="{ option }">
          <span class="font-semibold text-[color:var(--playground-text-strong)]">{{ option.label }}</span>
          <span class="text-[color:var(--playground-muted)]"> · {{ option.year }}</span>
        </template>
      </VueSelect>

      <DemoValue label="Selected book value">
        {{ selected || "none" }}
      </DemoValue>
    </DemoPanel>
  </DemoLayout>
</template>
