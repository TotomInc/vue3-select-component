<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

const selected = ref<string | null>(null);

const options: Option<string>[] = [
  { label: "Alice's Adventures in Wonderland", value: "alice" },
  { label: "A Wizard of Earthsea", value: "wizard" },
  { label: "Harry Potter and the Philosopher's Stone", value: "harry_potter_1" },
  { label: "Harry Potter and the Chamber of Secrets", value: "harry_potter_2" },
];
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="false"
    :is-taggable="true"
    placeholder="Pick a book"
  >
    <template #taggable-no-options="{ option }">
      <div class="custom-taggable-no-options">
        Create option: {{ option }}
      </div>
    </template>
  </VueSelect>

  <p class="selected-value">
    Selected book value: {{ selected || "none" }}
  </p>
</template>
