<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

const selected = ref<string | null>(null);

const roleOptions = [
  { id: "Admin", key: "admin" },
  { id: "User", key: "user" },
  { id: "Guest", key: "guest" },
];
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="(roleOptions as unknown as Option<string>[])"
    :is-multi="false"
    :get-option-label="option => (option.id as string)"
    :get-option-value="option => (option.key as string)"
    placeholder="Pick a role"
  />

  <p class="selected-value">
    Selected role: {{ selected || "none" }}
  </p>
</template>
