<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoValue from "../components/DemoValue.vue";

const selected = ref<string | null>(null);
const isMenuOpen = ref(false);

const options: Option<string>[] = [
  { label: "Alice's Adventures in Wonderland", value: "alice" },
  { label: "A Wizard of Earthsea", value: "wizard" },
  { label: "Harry Potter and the Philosopher's Stone", value: "harry_potter_1" },
  { label: "Harry Potter and the Chamber of Secrets", value: "harry_potter_2" },
];

const handleOpenMenu = () => {
  if (!isMenuOpen.value) {
    isMenuOpen.value = true;
  }
};
</script>

<template>
  <DemoLayout>
    <DemoHeader
      eyebrow="Controlled state"
      title="External menu control"
      description="Manage the dropdown open state externally while still responding to the component's open and close events."
    />

    <DemoPanel>
      <button
        type="button"
        class="w-fit rounded-xl border border-[color:rgba(34,211,238,0.5)] bg-[color:rgba(34,211,238,0.16)] px-4 py-2 text-sm font-medium text-[color:var(--playground-text-strong)] transition hover:bg-[color:rgba(34,211,238,0.24)]"
        @click="handleOpenMenu"
      >
        Toggle menu ({{ isMenuOpen ? "opened" : "closed" }})
      </button>

      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="false"
        :is-menu-open="isMenuOpen"
        placeholder="Pick a book"
        @menu-opened="isMenuOpen = true"
        @menu-closed="isMenuOpen = false"
      />

      <DemoValue label="Selected book value">
        {{ selected || "none" }}
      </DemoValue>
    </DemoPanel>
  </DemoLayout>
</template>
