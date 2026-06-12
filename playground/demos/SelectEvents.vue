<script setup lang="ts">
import { ref } from "vue";
import { Select } from "vue3-select-component";

import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";
import { countryOptions } from "../data/options";

const value = ref<string | null>(null);

type EventEntry = {
  name: string;
  detail: string;
};

const eventLog = ref<EventEntry[]>([]);

function logEvent(name: string, detail: unknown) {
  eventLog.value = [
    { name, detail: JSON.stringify(detail) },
    ...eventLog.value,
  ].slice(0, 10);
}

function onMenuOpened() {
  logEvent("menuOpened", null);
}

function onMenuClosed() {
  logEvent("menuClosed", null);
}

function onOptionSelected(option: (typeof countryOptions)[number]) {
  logEvent("optionSelected", option);
}

function onOptionDeselected(option: (typeof countryOptions)[number] | null) {
  logEvent("optionDeselected", option);
}
</script>

<template>
  <DemoSection
    title="Events"
    description="menuOpened, menuClosed, optionSelected, and optionDeselected emit source option objects."
  >
    <Select
      v-model="value"
      clearable
      searchable
      :options="countryOptions"
      placeholder="Interact to log events"
      @menu-opened="onMenuOpened"
      @menu-closed="onMenuClosed"
      @option-selected="onOptionSelected"
      @option-deselected="onOptionDeselected"
    />
    <DemoValue :value="value" />

    <div v-if="eventLog.length" class="demo-log">
      <p class="demo-log__title">
        Event log
      </p>
      <ul>
        <li v-for="(entry, index) in eventLog" :key="index">
          <strong>{{ entry.name }}</strong>
          <code>{{ entry.detail }}</code>
        </li>
      </ul>
    </div>
  </DemoSection>
</template>
