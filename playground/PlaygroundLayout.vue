<script setup lang="ts">
import type { DemoGroup } from "./demo-routes";
import { computed, nextTick, ref, useTemplateRef, watch } from "vue";

import { useRoute } from "vue-router";
import { demoGroups, demoRoutes } from "./demo-routes";

const route = useRoute();
const navRef = useTemplateRef<HTMLElement>("navRef");
const searchQuery = ref("");
const isNavOpen = ref(false);

type NavGroup = {
  name: DemoGroup;
  links: typeof demoRoutes;
};

const groupedLinks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return demoGroups.reduce<NavGroup[]>((groups, group) => {
    const links = demoRoutes.filter((link) => {
      if (link.group !== group) {
        return false;
      }

      if (!query) {
        return true;
      }

      return link.label.toLowerCase().includes(query);
    });

    if (links.length > 0) {
      groups.push({ name: group, links });
    }

    return groups;
  }, []);
});

const hasResults = computed(() => groupedLinks.value.length > 0);

function closeNavOnNavigate() {
  isNavOpen.value = false;
}

function scrollActiveLinkIntoView() {
  nextTick(() => {
    navRef.value
      ?.querySelector<HTMLElement>(".playground__link--active")
      ?.scrollIntoView({ block: "nearest" });
  });
}

watch(
  () => route.path,
  () => {
    scrollActiveLinkIntoView();
  },
  { immediate: true },
);
</script>

<template>
  <div class="playground">
    <aside
      class="playground__nav"
      :class="{ 'playground__nav--open': isNavOpen }"
    >
      <div class="playground__nav-header">
        <div>
          <h1 class="playground__title">
            vue3-select-component
          </h1>
          <p class="playground__subtitle">
            Playground
          </p>
        </div>

        <button
          type="button"
          class="playground__nav-toggle"
          :aria-expanded="isNavOpen"
          aria-controls="playground-nav"
          @click="isNavOpen = !isNavOpen"
        >
          {{ isNavOpen ? "Close" : "Demos" }}
        </button>
      </div>

      <div
        id="playground-nav"
        ref="navRef"
        class="playground__nav-body"
      >
        <label class="playground__search">
          <span class="playground__search-label">Filter demos</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search demos…"
            autocomplete="off"
          >
        </label>

        <nav aria-label="Demo navigation">
          <p v-if="!hasResults" class="playground__empty">
            No demos match your search.
          </p>

          <div
            v-for="group in groupedLinks"
            :key="group.name"
            class="playground__group"
          >
            <h2 class="playground__group-title">
              {{ group.name }}
            </h2>

            <ul class="playground__links">
              <li v-for="link in group.links" :key="link.path">
                <RouterLink
                  :to="`/${link.path}`"
                  class="playground__link"
                  active-class="playground__link--active"
                  @click="closeNavOnNavigate"
                >
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>

    <main class="playground__main">
      <RouterView />
    </main>
  </div>
</template>
