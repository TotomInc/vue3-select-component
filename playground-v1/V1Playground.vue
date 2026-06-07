<script setup lang="ts">
import type { SelectModelValue } from "@v1/types/model";
import type { SelectOption } from "@v1/types/option";

import { Select } from "@v1/index";
import { FlaskConical, Github } from "lucide-vue-next";
import { computed, ref, watch } from "vue";

import DemoHeader from "../playground/components/DemoHeader.vue";
import DemoPanel from "../playground/components/DemoPanel.vue";
import DemoPill from "../playground/components/DemoPill.vue";
import DemoSection from "../playground/components/DemoSection.vue";
import DemoValue from "../playground/components/DemoValue.vue";

type BooleanControl = {
  key: "multiple" | "searchable" | "clearable" | "disabled" | "loading" | "teleport";
  label: string;
  description: string;
};

const booleanControls: BooleanControl[] = [
  { key: "multiple", label: "Multiple", description: "Allow selecting more than one option." },
  { key: "searchable", label: "Searchable", description: "Filter options with a search input." },
  { key: "clearable", label: "Clearable", description: "Show a clear button when a value is set." },
  { key: "disabled", label: "Disabled", description: "Prevent all interaction." },
  { key: "loading", label: "Loading", description: "Show a loading indicator on the trigger." },
  { key: "teleport", label: "Teleport", description: "Portal the menu to document.body." },
];

const options = ref<SelectOption<string>[]>([
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Vue", value: "vue" },
  { label: "React", value: "react", disabled: true },
  { label: "Svelte", value: "svelte" },
]);

const model = ref<SelectModelValue<string>>(null);
const multiple = ref(false);
const searchable = ref(false);
const clearable = ref(false);
const disabled = ref(false);
const loading = ref(false);
const teleport = ref(false);
const placeholder = ref("Pick a framework");
const eventLog = ref<string[]>([]);

const modelDisplay = computed(() => JSON.stringify(model.value, null, 2));

const controlValues = computed(() => ({
  multiple: multiple.value,
  searchable: searchable.value,
  clearable: clearable.value,
  disabled: disabled.value,
  loading: loading.value,
  teleport: teleport.value,
}));

const emptyModel = (): SelectModelValue<string> => (multiple.value ? [] : null);

watch(multiple, () => {
  model.value = emptyModel();
});

function toggleBooleanControl(key: BooleanControl["key"]) {
  const refs = { multiple, searchable, clearable, disabled, loading, teleport } as const;
  refs[key].value = !refs[key].value;
}

function logEvent(message: string) {
  eventLog.value = [message, ...eventLog.value].slice(0, 8);
}

function toggleOptionDisabled(value: string) {
  const option = options.value.find((item) => item.value === value);

  if (!option) {
    return;
  }

  option.disabled = !option.disabled;
}
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b border-neutral-800/80 bg-[var(--playground-panel)]/80">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <FlaskConical class="h-5 w-5 text-green-400/80" />
            <h1 class="text-2xl font-semibold text-neutral-100">
              v1 Dev Playground
            </h1>
            <DemoPill>src-v1</DemoPill>
          </div>

          <p class="text-xs font-semibold text-neutral-500">
            Live preview with HMR — edits to <code class="font-mono text-neutral-400">src-v1/</code> reload instantly.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
          <a
            class="inline-flex items-center gap-2 rounded-full border border-neutral-800/80 px-3 py-1.5 transition hover:border-neutral-700 hover:text-neutral-200"
            href="https://github.com/TotomInc/vue3-select-component"
            rel="noreferrer"
            target="_blank"
          >
            <Github class="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </header>

    <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:flex-row">
      <aside class="flex w-full flex-col gap-6 lg:w-72 lg:shrink-0">
        <DemoSection
          title="Props"
          description="Toggle assembled Select props in real time."
        >
          <div class="flex flex-col gap-2">
            <label
              v-for="control in booleanControls"
              :key="control.key"
              class="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-800/80 bg-[var(--playground-panel)] px-3 py-2.5 transition hover:border-neutral-700"
            >
              <input
                type="checkbox"
                class="mt-0.5 accent-green-500"
                :checked="controlValues[control.key]"
                @change="toggleBooleanControl(control.key)"
              >
              <span class="grid gap-0.5">
                <span class="text-sm font-medium text-neutral-200">{{ control.label }}</span>
                <span class="text-xs text-neutral-500">{{ control.description }}</span>
              </span>
            </label>
          </div>
        </DemoSection>

        <DemoSection
          title="Placeholder"
          description="Customize the empty-state label."
        >
          <input
            v-model="placeholder"
            type="text"
            class="w-full rounded-lg border border-neutral-800/80 bg-[var(--playground-panel)] px-3 py-2 text-sm text-neutral-200 outline-none transition focus:border-green-500/50"
          >
        </DemoSection>

        <DemoSection
          title="Options"
          description="Toggle disabled state on individual options."
        >
          <div class="flex flex-col gap-1.5">
            <label
              v-for="option in options"
              :key="option.value"
              class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition hover:bg-neutral-800/50"
            >
              <input
                type="checkbox"
                class="accent-green-500"
                :checked="option.disabled"
                @change="toggleOptionDisabled(option.value)"
              >
              <span :class="option.disabled ? 'text-neutral-500 line-through' : 'text-neutral-300'">
                {{ option.label }}
              </span>
            </label>
          </div>
        </DemoSection>
      </aside>

      <main class="flex min-w-0 flex-1 flex-col gap-6">
        <DemoHeader
          eyebrow="Assembled Select"
          title="Interactive preview"
          description="The batteries-included v1 Select composes primitives into a ready-to-use control. Use the sidebar to explore prop combinations."
        />

        <DemoPanel accent>
          <Select
            v-model="model"
            :options="options"
            :multiple="multiple"
            :searchable="searchable"
            :clearable="clearable"
            :disabled="disabled"
            :loading="loading"
            :teleport="teleport || undefined"
            :placeholder="placeholder"
            @menu-opened="logEvent('menuOpened')"
            @menu-closed="logEvent('menuClosed')"
            @search="logEvent(`search: ${$event}`)"
            @option-selected="logEvent(`optionSelected: ${$event.label}`)"
            @option-deselected="logEvent(`optionDeselected: ${$event?.label ?? 'null'}`)"
          />

          <DemoValue label="modelValue">
            <code class="font-mono text-xs">{{ modelDisplay }}</code>
          </DemoValue>

          <DemoValue v-if="eventLog.length" label="Recent events">
            <ul class="space-y-1 font-mono text-xs text-neutral-400">
              <li v-for="entry in eventLog" :key="entry">
                {{ entry }}
              </li>
            </ul>
          </DemoValue>
        </DemoPanel>

        <DemoSection title="Quick reference">
          <div class="grid gap-3 text-sm text-neutral-400">
            <p>
              Run <code class="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-300">npm run dev:v1-playground</code>
              to start this environment.
            </p>
            <p>
              Import path: <code class="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-300">@v1/assembled/Select.vue</code>
              or primitives from <code class="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-300">@v1/primitives</code>.
            </p>
          </div>
        </DemoSection>
      </main>
    </div>
  </div>
</template>
