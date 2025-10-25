<script setup lang="ts">
import type { Option } from "../../src";
import { ref } from "vue";
import VueSelect from "../../src";

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
  <div>
    <h2>Custom Tag Content Slot</h2>
    <p>
      This demo shows the <code>#tag-content</code> slot which allows you to customize
      only the text inside a tag, while keeping the default structure, styling, and remove button.
    </p>

    <VueSelect
      v-model="selected"
      :options="options"
      :is-multi="true"
      placeholder="Select your skills"
    >
      <template #tag-content="{ option }">
        <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
          <span>{{ option.icon }}</span>
          <strong>{{ option.label }}</strong>
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

    <div style="margin-top: 20px">
      <h3>Selected Skills:</h3>
      <pre>{{ selected.length ? selected : "none" }}</pre>
    </div>

    <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px">
      <h3>Why use #tag-content instead of #tag?</h3>
      <ul>
        <li><strong>#tag-content</strong>: Only replaces the text inside the tag. The wrapper, styling, and remove button are preserved automatically.</li>
        <li><strong>#tag</strong>: Replaces the entire tag structure. You need to recreate the wrapper, styling, and remove button manually.</li>
      </ul>
      <p>Use <code>#tag-content</code> when you just want to format the label text differently without dealing with structure and event handlers.</p>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 10px;
}

p {
  margin-bottom: 20px;
  color: #666;
}

code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}

pre {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
