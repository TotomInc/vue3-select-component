<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "../../src/Select.vue";
import DemoCard from "../components/DemoCard.vue";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoKbd from "../components/DemoKbd.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoPill from "../components/DemoPill.vue";
import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";

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
  <DemoLayout>
    <DemoHeader
      eyebrow="Accessibility"
      title="Keyboard navigation"
      description="The select supports WAI-ARIA keyboard patterns out of the box. Use this demo to validate focus, navigation, and selection behaviors."
    />

    <DemoPanel>
      <DemoSection title="Basic keyboard navigation" description="Try these keyboard interactions:">
        <ul class="grid gap-2 text-sm text-[color:var(--playground-muted)]">
          <li><strong>Focus the input</strong> and press <DemoKbd>↑</DemoKbd> or <DemoKbd>↓</DemoKbd> to open the dropdown</li>
          <li><strong>Navigate</strong> with <DemoKbd>↑</DemoKbd> and <DemoKbd>↓</DemoKbd> arrow keys</li>
          <li><strong>Jump to first or last</strong> with <DemoKbd>Page Up</DemoKbd> and <DemoKbd>Page Down</DemoKbd></li>
          <li><strong>Select</strong> with <DemoKbd>Enter</DemoKbd> or <DemoKbd>Space</DemoKbd></li>
          <li><strong>Auto-select on blur</strong> by clicking outside after focusing an option</li>
        </ul>

        <VueSelect
          v-model="selectedCountry"
          :options="countries"
          placeholder="Select a country (try keyboard navigation)"
        />

        <DemoValue v-if="selectedCountry" label="Selected">
          {{ selectedCountry }}
        </DemoValue>
      </DemoSection>
    </DemoPanel>

    <DemoPanel>
      <DemoSection title="Multi-select with keyboard support" description="The same keyboard interactions work with multi-select.">
        <VueSelect
          v-model="selectedCountries"
          :options="countries"
          :is-multi="true"
          placeholder="Select multiple countries"
        />

        <DemoValue v-if="selectedCountries.length" label="Selected">
          {{ selectedCountries.join(", ") }}
        </DemoValue>
      </DemoSection>
    </DemoPanel>

    <DemoPanel>
      <DemoSection title="Disabled auto-select on blur">
        <template #header>
          <h2 class="text-lg font-semibold text-[color:var(--playground-text-strong)]">
            Disabled auto-select on blur
          </h2>
          <p class="text-sm text-[color:var(--playground-muted)]">
            With <DemoInlineCode>select-on-blur</DemoInlineCode> disabled, users must explicitly select options.
          </p>
        </template>

        <VueSelect
          v-model="manualSelection"
          :options="countries"
          :select-on-blur="false"
          placeholder="Navigate and click outside - no auto-selection"
        />

        <DemoValue v-if="manualSelection" label="Selected">
          {{ manualSelection }}
        </DemoValue>
      </DemoSection>
    </DemoPanel>

    <DemoPanel accent>
      <DemoSection title="Keyboard shortcuts reference">
        <div class="grid gap-3 sm:grid-cols-2">
          <DemoCard>
            <span><DemoKbd>↑</DemoKbd> / <DemoKbd>↓</DemoKbd></span>
            <span class="text-xs text-[color:var(--playground-muted)]">Open dropdown or navigate options</span>
          </DemoCard>
          <DemoCard>
            <span><DemoKbd>Page Up</DemoKbd></span>
            <span class="text-xs text-[color:var(--playground-muted)]">Jump to first option</span>
          </DemoCard>
          <DemoCard>
            <span><DemoKbd>Page Down</DemoKbd></span>
            <span class="text-xs text-[color:var(--playground-muted)]">Jump to last option</span>
          </DemoCard>
          <DemoCard>
            <span><DemoKbd>Enter</DemoKbd> / <DemoKbd>Space</DemoKbd></span>
            <span class="text-xs text-[color:var(--playground-muted)]">Select focused option</span>
          </DemoCard>
          <DemoCard>
            <span><DemoKbd>Escape</DemoKbd></span>
            <span class="text-xs text-[color:var(--playground-muted)]">Close dropdown</span>
          </DemoCard>
          <DemoCard>
            <span><DemoKbd>Tab</DemoKbd></span>
            <span class="text-xs text-[color:var(--playground-muted)]">Close dropdown and move to next element</span>
          </DemoCard>
          <DemoCard>
            <span><DemoKbd>Backspace</DemoKbd></span>
            <span class="text-xs text-[color:var(--playground-muted)]">Remove last selected option (multi-select)</span>
          </DemoCard>
          <DemoCard>
            <DemoPill>Click outside</DemoPill>
            <span class="text-xs text-[color:var(--playground-muted)]">Auto-select focused option (when enabled)</span>
          </DemoCard>
        </div>
      </DemoSection>
    </DemoPanel>
  </DemoLayout>
</template>
