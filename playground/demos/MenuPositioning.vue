<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "../../src/Select.vue";

const options = [
  { label: "France", value: "FR" },
  { label: "Germany", value: "DE" },
  { label: "Spain", value: "ES" },
  { label: "Italy", value: "IT" },
  { label: "Portugal", value: "PT" },
];

const selected = ref<string | null>(null);
</script>

<template>
  <div class="demo-container">
    <h2>Menu Positioning with data-state-position</h2>
    <p>
      The dropdown menu includes a <code>data-state-position</code> attribute that reflects
      its current position. This demo shows how the attribute changes based on available space.
    </p>

    <div class="demo-section">
      <h3>Normal Position (bottom-start)</h3>
      <p>Scroll down to see the menu flip to the top when there's no space below.</p>
      <VueSelect
        v-model="selected"
        :options="options"
        placeholder="Select a country"
        class="custom-position-demo"
      />
    </div>

    <div style="height: 100vh; display: flex; align-items: center;">
      <div class="demo-section">
        <h3>Middle of Page</h3>
        <p>The menu should open downward here.</p>
        <VueSelect
          v-model="selected"
          :options="options"
          placeholder="Select a country"
          class="custom-position-demo"
        />
      </div>
    </div>

    <div style="height: 100vh; display: flex; align-items: flex-end; padding-bottom: 50px;">
      <div class="demo-section">
        <h3>Bottom of Page (menu flips to top-start)</h3>
        <p>The menu should open upward here with different styling.</p>
        <VueSelect
          v-model="selected"
          :options="options"
          placeholder="Select a country"
          class="custom-position-demo"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 600px;
}

.demo-section {
  margin-bottom: 30px;
  width: 100%;
}

h2 {
  margin-bottom: 10px;
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
}

p {
  margin-bottom: 15px;
  color: #666;
}

code {
  background-color: #f4f4f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 14px;
}

:deep(.custom-position-demo) {
  --vs-border-radius: 8px;
}

/* Style menu differently based on position */
:deep(.menu[data-state-position^="top"]) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1);
}

:deep(.menu[data-state-position^="bottom"]) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Add visual indicator for position */
:deep(.menu[data-state-position="bottom-start"]::before) {
  content: "↓ bottom-start";
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 10px;
  color: #999;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

:deep(.menu[data-state-position="top-start"]::before) {
  content: "↑ top-start";
  position: absolute;
  bottom: 4px;
  right: 8px;
  font-size: 10px;
  color: #999;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
