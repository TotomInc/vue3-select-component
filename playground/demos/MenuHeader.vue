<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

const selected = ref<string | null>(null);

const options: Option<string>[] = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
  { label: "Guest", value: "guest" },
];
</script>

<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :is-multi="false"
    placeholder="Pick a role"
  >
    <template #menu-header>
      <h3>User roles</h3>
    </template>
  </VueSelect>

  <p class="selected-value">
    Selected role value: {{ selected || "none" }}
  </p>
</template>
