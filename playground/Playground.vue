<script setup lang="ts">
import type { Option } from "../src/types";

import { ref } from "vue";
import VueSelect from "../src/Select.vue";

type BookOption = Option<string>;
type UserOption = Option<number> & { username: string };

const activeBook = ref<string | null>(null);
const activeUsers = ref<number[]>([1, 3]);
const activeLanguages = ref<string[]>([]);
const activeRole = ref<string | null>(null);
const isLoading = ref(false);

const bookOptions: BookOption[] = [
  { label: "Alice's Adventures in Wonderland", value: "alice" },
  { label: "A Wizard of Earthsea", value: "wizard" },
  { label: "Harry Potter and the Philosopher's Stone", value: "harry_potter_1" },
  { label: "Harry Potter and the Chamber of Secrets", value: "harry_potter_2" },
];

const userOptions: UserOption[] = [
  { label: "Alice", value: 1, username: "alice" },
  { label: "Bob", value: 2, username: "bob" },
  { label: "Charlie", value: 3, username: "charlie" },
  { label: "David", value: 4, username: "david" },
  { label: "John", value: 5, username: "john" },
  { label: "Admin", value: 6, username: "admin" },
  { label: "Root", value: 6, username: "root" },
];

const languageOptions = ref<Option<string>[]>([
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
  { label: "Ruby", value: "ruby" },
  { label: "Go", value: "go" },
]);

const roleOptions = [
  { id: "Admin", key: "admin" },
  { id: "User", key: "user" },
  { id: "Guest", key: "guest" },
];

const handleCreateOption = (value: string) => {
  languageOptions.value.push({ label: value, value });
  activeLanguages.value.push(value);
};
</script>

<template>
  <div class="container">
    <form class="form-container" @submit.prevent="null">
      <VueSelect
        v-model="activeBook"
        :options="bookOptions"
        :is-multi="false"
        :is-loading="isLoading"
        placeholder="Pick a book"
      />

      <p class="selected-value">
        Selected book value: {{ activeBook || "none" }}
      </p>

      <VueSelect
        v-model="activeUsers"
        :options="userOptions"
        :is-multi="true"
        :is-loading="isLoading"
        placeholder="Pick users"
      />

      <p class="selected-value">
        Selected user value: {{ activeUsers || "none" }}
      </p>

      <VueSelect
        v-model="activeLanguages"
        :options="languageOptions"
        :is-multi="true"
        :is-taggable="true"
        placeholder="Pick a language"
        @option-created="(value) => handleCreateOption(value)"
      />

      <VueSelect
        v-model="activeRole"
        :options="(roleOptions as unknown as Option<string>[])"
        :is-multi="false"
        :get-option-label="option => (option.id as string)"
        :get-option-value="option => (option.key as string)"
        placeholder="Pick a role"
      />

      <p class="selected-value">
        Selected role value: {{ activeRole || "none" }}
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
