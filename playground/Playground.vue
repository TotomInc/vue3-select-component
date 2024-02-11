<script setup lang="ts">
import { ref } from "vue";

import VueSelect from "../src/Select.vue";

const option = ref<string>("");
const options = ref<string[]>([]);
</script>

<template>
  <div class="container">
    <VueSelect
      v-model="options"
      :is-multi="true"
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
      placeholder="Select a value"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300..900&display=swap');

body {
  -webkit-font-smoothing: antialiased;
  margin: 0;
  font-family: "Inter", sans-serif;
}

.container {
  width: 100%;
  max-width: 512px;
  padding: 2rem;
  margin: 0 auto;
}
</style>
