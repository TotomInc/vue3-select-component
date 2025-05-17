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
    placeholder="Pick a book"
  >
    <template #menu-container="{ defaultContent }">
      <div class="custom-menu-container">
        <template v-if="defaultContent">
          <component :is="defaultContent" />
        </template>
      </div>
    </template>
  </VueSelect>

  <p class="selected-value">
    Selected book value: {{ selected || "none" }}
  </p>
</template>

<style lang="css" scoped>
.custom-menu-container {
  background-color: #eff6ff;
  padding: 4px;
}
</style>
