<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoValue from "../components/DemoValue.vue";

const selected = ref<string | null>(null);

const roleOptions = [
  { id: "Admin", key: "admin" },
  { id: "User", key: "user" },
  { id: "Guest", key: "guest" },
];
</script>

<template>
  <DemoLayout>
    <DemoHeader eyebrow="Data mapping" title="Custom label and value">
      <template #description>
        Use <DemoInlineCode>get-option-label</DemoInlineCode> and
        <DemoInlineCode>get-option-value</DemoInlineCode> to adapt non-standard option shapes without transforming
        the dataset.
      </template>
    </DemoHeader>

    <DemoPanel>
      <VueSelect
        v-model="selected"
        :options="(roleOptions as unknown as Option<string>[])"
        :is-multi="false"
        :get-option-label="option => (option.id as string)"
        :get-option-value="option => (option.key as string)"
        placeholder="Pick a role"
      />

      <DemoValue label="Selected role">
        {{ selected || "none" }}
      </DemoValue>
    </DemoPanel>
  </DemoLayout>
</template>
