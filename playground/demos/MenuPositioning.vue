<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "../../src/Select.vue";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoSection from "../components/DemoSection.vue";

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
  <DemoLayout>
    <DemoHeader eyebrow="Layout" title="Menu positioning">
      <template #description>
        The menu exposes <DemoInlineCode>data-state-position</DemoInlineCode> so you can style the dropdown
        differently when it flips.
      </template>
    </DemoHeader>

    <DemoPanel>
      <DemoSection
        title="Normal position (bottom-start)"
        description="Scroll to see how the menu flips when space runs out."
      >
        <VueSelect
          v-model="selected"
          :options="options"
          placeholder="Select a country"
          class="custom-position-demo"
        />
      </DemoSection>
    </DemoPanel>

    <div class="flex h-[70vh] items-center">
      <DemoPanel accent class="w-full">
        <DemoSection title="Middle of the page" description="The menu should open downward here.">
          <VueSelect
            v-model="selected"
            :options="options"
            placeholder="Select a country"
            class="custom-position-demo"
          />
        </DemoSection>
      </DemoPanel>
    </div>

    <div class="flex h-[70vh] items-center">
      <DemoPanel class="w-full">
        <DemoSection title="Bottom of the page (top-start)" description="The menu should open upward here.">
          <VueSelect
            v-model="selected"
            :options="options"
            placeholder="Select a country"
            class="custom-position-demo"
          />
        </DemoSection>
      </DemoPanel>
    </div>
  </DemoLayout>
</template>

<style scoped>
::deep(.custom-position-demo) {
  --vs-border-radius: 12px;
}

::deep(.menu[data-state-position^="top"]) {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 -10px 18px -14px rgb(0 0 0 / 0.6);
}

::deep(.menu[data-state-position^="bottom"]) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 10px 18px -14px rgb(0 0 0 / 0.6);
}

::deep(.menu[data-state-position="bottom-start"]::before) {
  content: "bottom-start";
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 10px;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

::deep(.menu[data-state-position="top-start"]::before) {
  content: "top-start";
  position: absolute;
  bottom: 4px;
  right: 8px;
  font-size: 10px;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
