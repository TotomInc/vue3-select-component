<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "../../src/Select.vue";

const selectedCountry = ref<string | null>(null);
const selectedCountries = ref<string[]>([]);
const manualSelection = ref<string | null>(null);

const countries = [
  { label: "France", value: "FR" },
  { label: "Germany", value: "DE" },
  { label: "Italy", value: "IT" },
  { label: "Spain", value: "ES" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "Australia", value: "AU" },
  { label: "Japan", value: "JP" },
  { label: "Brazil", value: "BR" },
  { label: "India", value: "IN" },
  { label: "China", value: "CN" },
];
</script>

<template>
  <div class="keyboard-navigation-demo">
    <h2>WAI-ARIA Keyboard Navigation Demo</h2>

    <div class="demo-section">
      <h3>Basic Keyboard Navigation</h3>
      <p>Try these keyboard interactions:</p>
      <ul>
        <li><strong>Focus the input</strong> and press <kbd>↑</kbd> or <kbd>↓</kbd> to open the dropdown</li>
        <li><strong>Navigate</strong> with <kbd>↑</kbd> and <kbd>↓</kbd> arrow keys</li>
        <li><strong>Jump to first/last</strong> with <kbd>Page Up</kbd> and <kbd>Page Down</kbd></li>
        <li><strong>Select</strong> with <kbd>Enter</kbd> or <kbd>Space</kbd></li>
        <li><strong>Auto-select on blur</strong> - navigate to an option and click outside to select it</li>
      </ul>

      <VueSelect
        v-model="selectedCountry"
        :options="countries"
        placeholder="Select a country (try keyboard navigation)"
        class="demo-select"
      />

      <div v-if="selectedCountry" class="selected-info">
        <strong>Selected:</strong> {{ selectedCountry }}
      </div>
    </div>

    <div class="demo-section">
      <h3>Multi-Select with Keyboard Navigation</h3>
      <p>Same keyboard interactions work with multi-select:</p>

      <VueSelect
        v-model="selectedCountries"
        :options="countries"
        :is-multi="true"
        placeholder="Select multiple countries"
        class="demo-select"
      />

      <div v-if="selectedCountries.length" class="selected-info">
        <strong>Selected:</strong> {{ selectedCountries.join(', ') }}
      </div>
    </div>

    <div class="demo-section">
      <h3>Disabled Auto-Select on Blur</h3>
      <p>With <code>selectOnBlur: false</code>, you must explicitly select options:</p>

      <VueSelect
        v-model="manualSelection"
        :options="countries"
        :select-on-blur="false"
        placeholder="Navigate and click outside - no auto-selection"
        class="demo-select"
      />

      <div v-if="manualSelection" class="selected-info">
        <strong>Selected:</strong> {{ manualSelection }}
      </div>
    </div>

    <div class="demo-section">
      <h3>Keyboard Shortcuts Reference</h3>
      <div class="shortcuts-grid">
        <div class="shortcut-item">
          <kbd>↑</kbd> / <kbd>↓</kbd>
          <span>Open dropdown (when closed) or navigate options</span>
        </div>
        <div class="shortcut-item">
          <kbd>Page Up</kbd>
          <span>Jump to first option</span>
        </div>
        <div class="shortcut-item">
          <kbd>Page Down</kbd>
          <span>Jump to last option</span>
        </div>
        <div class="shortcut-item">
          <kbd>Enter</kbd> / <kbd>Space</kbd>
          <span>Select focused option</span>
        </div>
        <div class="shortcut-item">
          <kbd>Escape</kbd>
          <span>Close dropdown</span>
        </div>
        <div class="shortcut-item">
          <kbd>Tab</kbd>
          <span>Close dropdown and move to next element</span>
        </div>
        <div class="shortcut-item">
          <kbd>Backspace</kbd>
          <span>Remove last selected option (multi-select)</span>
        </div>
        <div class="shortcut-item">
          <span class="blur-action">Click outside</span>
          <span>Auto-select focused option (when selectOnBlur: true)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.keyboard-navigation-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  background: #fafafa;
}

.demo-section h3 {
  margin-top: 0;
  color: #18181b;
}

.demo-select {
  margin: 16px 0;
}

.selected-info {
  margin-top: 12px;
  padding: 8px 12px;
  background: #dbeafe;
  border-radius: 4px;
  color: #1e40af;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 16px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e4e4e7;
}

.shortcut-item kbd {
  display: inline-block;
  padding: 2px 6px;
  background: #f4f4f5;
  border: 1px solid #d4d4d8;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.blur-action {
  display: inline-block;
  padding: 2px 6px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 3px;
  font-size: 12px;
  color: #92400e;
}

ul {
  margin: 12px 0;
  padding-left: 20px;
}

li {
  margin: 8px 0;
}

code {
  background: #f4f4f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 14px;
}
</style>
