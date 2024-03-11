<script setup lang="ts">
import { ref } from "vue";

import VueSelect from "../src/Select.vue";

const option = ref<string>("");
// eslint-disable-next-line unused-imports/no-unused-vars
const options = ref<string[]>([]);
</script>

<template>
  <div class="container">
    <form class="form-container" @submit.prevent="null">
      <VueSelect
        v-model="option"
        :is-multi="false"
        :options="[
          { label: 'Alice\'s Adventures in Wonderland', value: 'alice_in_wonderland', extra: 'hello' },
          { label: 'A Wizard of Earthsea', value: 'wizard_earthsea', extra: 'world' },
          { label: 'Harry Potter and the Philosopher\'s Stone', value: 'harry_potter_1997', extra: 'hw' },
          { label: 'Harry Potter and the Chamber of Secrets', value: 'harry_potter_1998', extra: 'hw2' },
          { label: 'Harry Potter and the Prisoner of Azkaban', value: 'harry_potter_1999', extra: 'hw3' },
          { label: 'The Lord of the Rings', value: 'tlotr', extra: 'hw4' },
          { label: 'The Hobbit', value: 'hobbit', extra: 'hw5' },
          { label: 'The Silmarillion', value: 'silmarillion', extra: 'hw6' },
        ]"
        placeholder="Pick a book"
      />

      <p class="selected-value">
        Selected value: {{ option || "none" }}
      </p>
    </form>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300..900&display=swap');

body {
  -webkit-font-smoothing: antialiased;
  margin: 0;
  font-family: "Inter", sans-serif;
}
</style>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 4rem);
  padding: 2rem;
  background-color: #f4f4f5;

  .form-container {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    padding: 2rem;
    margin: 0 auto;
    border-radius: 6px;
    background-color: #fff;

    .selected-value {
      font-size: 14px;
      font-weight: 500;
      font-family: "IBM Plex Mono", monospace;
    }
  }
}
</style>
