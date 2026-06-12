<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";

const items = ref(["Backlog", "Todo", "In Progress", "Done"]);
const value = ref("Backlog");
const alwaysValue = ref<string | null>(null);
const alwaysItems = ref(["Backlog", "Todo", "In Progress", "Done"]);

function onCreate(item: string) {
  items.value.push(item);
  value.value = item;
}

function onAlwaysCreate(item: string) {
  alwaysItems.value.push(item);
  alwaysValue.value = item;
}
</script>

<template>
  <DemoSection
    title="Create item"
    description="Add a custom value when search has no matches. Handle @create to update options and v-model."
  >
    <Select
      v-model="value"
      :create-item="true"
      :options="items"
      :get-option-label="(item) => item"
      :get-option-value="(item) => item"
      placeholder="Pick or create a status"
      @create="onCreate"
    />
    <DemoValue :value="value" />
  </DemoSection>

  <DemoSection
    title="Create item always"
    description="With create-item=&quot;always&quot;, the create action stays visible while searching, even when options match."
  >
    <Select
      v-model="alwaysValue"
      create-item="always"
      :options="alwaysItems"
      :get-option-label="(item) => item"
      :get-option-value="(item) => item"
      placeholder="Search statuses"
      @create="onAlwaysCreate"
    >
      <template #create-item="{ searchValue }">
        <span class="demo-create-item">
          Add "{{ searchValue }}"
        </span>
      </template>
    </Select>
    <DemoValue :value="alwaysValue" />
  </DemoSection>
</template>
