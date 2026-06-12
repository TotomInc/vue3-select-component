<script setup lang="ts">
const links = [
  { path: "/single", label: "Single select" },
  { path: "/multi", label: "Multi select" },
  { path: "/searchable", label: "Searchable" },
  { path: "/clearable", label: "Clearable" },
  { path: "/disabled", label: "Disabled" },
  { path: "/disabled-options", label: "Disabled options" },
  { path: "/loading", label: "Loading" },
  { path: "/pre-selected", label: "Pre-selected" },
  { path: "/close-on-select", label: "Close on select" },
  { path: "/hide-selected", label: "Hide selected" },
  { path: "/custom-mapping", label: "Custom option mapping" },
  { path: "/custom-filter", label: "Custom filter" },
  { path: "/no-options-slot", label: "No options slot" },
  { path: "/tag-remove-slot", label: "Tag remove slot" },
  { path: "/clear-slot", label: "Clear slot" },
  { path: "/icon-slots", label: "Icon slots" },
  { path: "/menu-positioning", label: "Menu positioning" },
  { path: "/search-event", label: "Search event" },
  { path: "/events", label: "Events" },
];
</script>

<template>
  <div class="playground">
    <aside class="playground__nav">
      <h1 class="playground__title">
        vue3-select
      </h1>
      <p class="playground__subtitle">
        Playground
      </p>

      <nav aria-label="Demo navigation">
        <ul class="playground__links">
          <li v-for="link in links" :key="link.path">
            <RouterLink
              :to="link.path"
              class="playground__link"
              active-class="playground__link--active"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="playground__main">
      <RouterView />
    </main>
  </div>
</template>
