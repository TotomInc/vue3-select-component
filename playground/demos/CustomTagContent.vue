<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";
import DemoHeader from "../components/DemoHeader.vue";
import DemoInlineCode from "../components/DemoInlineCode.vue";
import DemoLayout from "../components/DemoLayout.vue";
import DemoPanel from "../components/DemoPanel.vue";
import DemoSection from "../components/DemoSection.vue";
import DemoValue from "../components/DemoValue.vue";

const selected = ref<string[]>([]);

type SkillOption = {
  level: "beginner" | "intermediate" | "expert";
  icon: string;
} & Option<string>;

const options = ref<SkillOption[]>([
  { label: "JavaScript", value: "javascript", level: "expert", icon: "🟨" },
  { label: "TypeScript", value: "typescript", level: "expert", icon: "🔷" },
  { label: "Vue.js", value: "vue", level: "expert", icon: "💚" },
  { label: "React", value: "react", level: "intermediate", icon: "⚛️" },
  { label: "Python", value: "python", level: "beginner", icon: "🐍" },
  { label: "Rust", value: "rust", level: "beginner", icon: "🦀" },
]);

const levelColors = {
  beginner: "#93c5fd",
  intermediate: "#86efac",
  expert: "#fde047",
};
</script>

<template>
  <DemoLayout>
    <DemoHeader eyebrow="Slots" title="Custom tag content">
      <template #description>
        Use <DemoInlineCode>#tag-content</DemoInlineCode> when you want to format tag labels but keep the default
        tag wrapper and remove button.
      </template>
    </DemoHeader>

    <DemoPanel>
      <VueSelect
        v-model="selected"
        :options="options"
        :is-multi="true"
        placeholder="Select your skills"
      >
        <template #tag-content="{ option }">
          <span class="flex items-center gap-1.5">
            <span>{{ option.icon }}</span>
            <span class="font-semibold text-[color:var(--playground-text-strong)]">{{ option.label }}</span>
            <span
              :style="{
                fontSize: '10px',
                padding: '2px 4px',
                borderRadius: '2px',
                backgroundColor: levelColors[option.level],
                color: '#000',
                fontWeight: 500,
              }"
            >
              {{ option.level }}
            </span>
          </span>
        </template>
      </VueSelect>

      <DemoValue label="Selected skills">
        {{ selected.length ? selected : "none" }}
      </DemoValue>
    </DemoPanel>

    <DemoPanel accent>
      <DemoSection title="Why use #tag-content instead of #tag?">
        <ul class="grid gap-2 text-sm text-[color:var(--playground-muted)]">
          <li><strong>#tag-content</strong> keeps the wrapper, styling, and remove button intact.</li>
          <li><strong>#tag</strong> replaces the entire tag structure, so you must rebuild the wrapper and actions.</li>
        </ul>
        <p class="text-sm text-[color:var(--playground-muted)]">
          Choose <DemoInlineCode>#tag-content</DemoInlineCode> for visual tweaks without extra event wiring.
        </p>
      </DemoSection>
    </DemoPanel>
  </DemoLayout>
</template>
