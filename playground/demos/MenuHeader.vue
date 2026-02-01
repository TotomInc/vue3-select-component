<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoPill from "../components/DemoPill.vue";
import DemoValue from "../components/DemoValue.vue";

const selected = ref<string | null>(null);

const options: Option<string>[] = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
  { label: "Guest", value: "guest" },
];
</script>

<template>
  <DemoLayout>
    <DemoHeader eyebrow="Slots" title="Menu header">
      <template #description>
        Add context at the top of the dropdown with the <DemoInlineCode>#menu-header</DemoInlineCode> slot.
      </template>
    </DemoHeader>

    <DemoPanel>
      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="false"
        placeholder="Pick a role"
      >
        <template #menu-header>
          <div class="flex flex-wrap items-center gap-3">
            <DemoPill>User roles</DemoPill>
            <span class="text-xs text-[color:var(--playground-muted)]">Manage access levels</span>
          </div>
        </template>
      </VueSelect>

      <DemoValue label="Selected role value">
        {{ selected || "none" }}
      </DemoValue>
    </DemoPanel>
  </DemoLayout>
</template>
