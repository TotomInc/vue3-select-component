<script setup lang="ts">
import type { Option } from "../src";
import { BookOpen, Code2, Github } from "lucide-vue-next";
import { createHighlighter } from "shiki";
import { computed, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import Select from "../src";

type DemoItem = {
  value: string;
  label: string;
  description: string;
  fileName: string;
};

const sections: { title: string; items: DemoItem[] }[] = [
  {
    title: "Basics",
    items: [
      {
        value: "/single-select",
        label: "Single Select",
        description: "Baseline setup for single choice.",
        fileName: "SingleSelect.vue",
      },
      {
        value: "/multi-select",
        label: "Multi Select",
        description: "Multiple choices with tags.",
        fileName: "MultiSelect.vue",
      },
      {
        value: "/multi-select-taggable",
        label: "Multi Select Taggable",
        description: "Add custom items on the fly.",
        fileName: "MultiSelectTaggable.vue",
      },
    ],
  },
  {
    title: "Customization",
    items: [
      {
        value: "/custom-placeholder",
        label: "Custom Placeholder",
        description: "Polished empty-state messaging.",
        fileName: "CustomPlaceholder.vue",
      },
      {
        value: "/custom-tag-content",
        label: "Custom Tag Content",
        description: "Richer tag rendering patterns.",
        fileName: "CustomTagContent.vue",
      },
      {
        value: "/extra-option-properties",
        label: "Extra Option Properties",
        description: "Expose additional option metadata.",
        fileName: "ExtraOptionProperties.vue",
      },
      {
        value: "/custom-option-label-value",
        label: "Custom Option Label/Value",
        description: "Alternate label/value mapping.",
        fileName: "CustomOptionLabelValue.vue",
      },
    ],
  },
  {
    title: "Behavior",
    items: [
      {
        value: "/select-is-loading",
        label: "Select isLoading",
        description: "Async data loading states.",
        fileName: "SelectIsLoading.vue",
      },
      {
        value: "/no-select-on-blur",
        label: "No Select on Blur",
        description: "Keep menu focus without selecting.",
        fileName: "NoSelectOnBlur.vue",
      },
      {
        value: "/taggable-no-options-slot",
        label: "Taggable No Options Slot",
        description: "Custom empty list messaging.",
        fileName: "TaggableNoOptionsSlot.vue",
      },
    ],
  },
  {
    title: "Advanced",
    items: [
      {
        value: "/controlled-menu",
        label: "Controlled Menu",
        description: "External menu state control.",
        fileName: "ControlledMenu.vue",
      },
      {
        value: "/menu-header",
        label: "Menu Header",
        description: "Insert contextual menu content.",
        fileName: "MenuHeader.vue",
      },
      {
        value: "/menu-positioning",
        label: "Menu Positioning",
        description: "Floating UI alignment.",
        fileName: "MenuPositioning.vue",
      },
      {
        value: "/keyboard-navigation",
        label: "Keyboard Navigation",
        description: "Fine-grained keyboard control.",
        fileName: "KeyboardNavigation.vue",
      },
      {
        value: "/search-event",
        label: "Search Event",
        description: "React to search input changes.",
        fileName: "SearchEvent.vue",
      },
    ],
  },
];

const router = useRouter();
const route = useRoute();
const activeLink = ref<string | null>(route.path);
const sourceHtml = ref("");
const sourceLoading = ref(false);
const sourceError = ref("");
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

const rawBaseUrl
  = "https://raw.githubusercontent.com/TotomInc/vue3-select-component/refs/heads/master/playground/demos";

const demoItems = computed<DemoItem[]>(() => sections.flatMap((section) => section.items));
const currentDemo = computed(() => demoItems.value.find((item) => item.value === route.path) ?? null);
const currentSourceUrl = computed(() =>
  currentDemo.value?.fileName ? `${rawBaseUrl}/${currentDemo.value.fileName}` : null,
);

const navOptions = computed<Option<string>[]>(() =>
  sections.flatMap((section) =>
    section.items.map((item) => ({ value: item.value, label: `${section.title} - ${item.label}` })),
  ),
);

const getHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      langs: ["vue"],
      themes: ["github-dark"],
    });
  }

  return highlighterPromise;
};

const loadSource = async () => {
  const sourceUrl = currentSourceUrl.value;

  if (!sourceUrl) {
    sourceHtml.value = "";
    sourceError.value = "";
    return;
  }

  sourceLoading.value = true;
  sourceError.value = "";

  try {
    const response = await fetch(sourceUrl);

    if (!response.ok) {
      throw new Error(`Failed to load demo source (${response.status})`);
    }

    const code = await response.text();
    const highlighter = await getHighlighter();

    sourceHtml.value = highlighter.codeToHtml(code, {
      lang: "vue",
      theme: "github-dark",
    });
  }
  catch (error) {
    sourceError.value = error instanceof Error ? error.message : "Unable to load demo source.";
    sourceHtml.value = "";
  }
  finally {
    sourceLoading.value = false;
  }
};

const handleNavigation = (option: Option<string>) => {
  router.push(option.value);
};

watch(
  () => route.path,
  (path) => {
    activeLink.value = path;
  },
);

watch(currentSourceUrl, loadSource, { immediate: true });
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b border-slate-800/80 bg-[var(--playground-panel)]/80">
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold text-slate-500">
            Vue 3 Select Component
          </p>

          <h1 class="text-2xl font-semibold text-slate-100">
            Playground
          </h1>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <a
            class="inline-flex items-center gap-2 rounded-full border border-slate-800/80 px-3 py-1.5 transition hover:border-slate-700 hover:text-slate-200"
            href="https://totominc.github.io/vue3-select-component/"
            rel="noreferrer"
            target="_blank"
          >
            <BookOpen class="h-4 w-4" />
            Documentation
          </a>
          <a
            class="inline-flex items-center gap-2 rounded-full border border-slate-800/80 px-3 py-1.5 transition hover:border-slate-700 hover:text-slate-200"
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
      <aside class="flex w-full flex-col gap-5 lg:w-64">
        <div class="lg:hidden">
          <Select
            v-model="activeLink"
            :options="navOptions"
            placeholder="Jump to a demo"
            @option-selected="handleNavigation"
          />
        </div>

        <nav class="flex flex-col gap-6">
          <div
            v-for="section in sections"
            :key="section.title"
            class="space-y-2"
          >
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
              {{ section.title }}
            </p>
            <div class="flex flex-col gap-2">
              <RouterLink
                v-for="item in section.items"
                :key="item.value"
                :to="item.value"
                class="rounded-lg border px-3 py-2 text-sm transition"
                :class="
                  route.path === item.value
                    ? 'border-cyan-400/40 bg-[var(--playground-panel-strong)] text-slate-100'
                    : 'border-slate-800/80 bg-[var(--playground-panel)] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                "
              >
                <div class="font-medium text-slate-200">
                  {{ item.label }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ item.description }}
                </div>
              </RouterLink>
            </div>
          </div>
        </nav>
      </aside>

      <main class="flex min-w-0 flex-1 flex-col gap-6">
        <form
          class="rounded-xl border border-slate-800/80 bg-[var(--playground-panel)] p-6"
          @submit.prevent="null"
        >
          <RouterView />
        </form>

        <section class="rounded-xl border border-slate-800/80 bg-[var(--playground-panel)]">
          <div class="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
            <div class="inline-flex items-center gap-2 text-sm text-slate-300">
              <Code2 class="h-4 w-4 text-cyan-300/80" />
              Source code
            </div>
            <a
              v-if="currentSourceUrl"
              class="text-xs text-slate-500 transition hover:text-slate-300"
              :href="currentSourceUrl"
              rel="noreferrer"
              target="_blank"
            >
              View raw
            </a>
          </div>

          <div class="min-h-[140px] px-4 py-4 text-sm text-slate-400">
            <div v-if="sourceLoading">
              Loading source...
            </div>
            <div v-else-if="sourceError" class="text-rose-300">
              {{ sourceError }}
            </div>
            <div
              v-else-if="sourceHtml"
              class="shiki-container"
              v-html="sourceHtml"
            />
            <div v-else>
              Source unavailable for this demo.
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
