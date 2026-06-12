import { createRouter, createWebHistory } from "vue-router";

import PlaygroundLayout from "../PlaygroundLayout.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: PlaygroundLayout,
      children: [
        { path: "", redirect: "/single" },
        {
          path: "single",
          component: () => import("../demos/SingleSelect.vue"),
        },
        {
          path: "multi",
          component: () => import("../demos/MultiSelect.vue"),
        },
        {
          path: "searchable",
          component: () => import("../demos/SearchableSelect.vue"),
        },
        {
          path: "clearable",
          component: () => import("../demos/ClearableSelect.vue"),
        },
        {
          path: "disabled",
          component: () => import("../demos/DisabledSelect.vue"),
        },
        {
          path: "disabled-options",
          component: () => import("../demos/DisabledOptions.vue"),
        },
        {
          path: "loading",
          component: () => import("../demos/LoadingSelect.vue"),
        },
        {
          path: "pre-selected",
          component: () => import("../demos/PreSelected.vue"),
        },
        {
          path: "close-on-select",
          component: () => import("../demos/MultiCloseOnSelect.vue"),
        },
        {
          path: "hide-selected",
          component: () => import("../demos/HideSelected.vue"),
        },
        {
          path: "custom-mapping",
          component: () => import("../demos/CustomOptionMapping.vue"),
        },
        {
          path: "custom-filter",
          component: () => import("../demos/CustomFilter.vue"),
        },
        {
          path: "no-options-slot",
          component: () => import("../demos/NoOptionsSlot.vue"),
        },
        {
          path: "tag-remove-slot",
          component: () => import("../demos/TagRemoveSlot.vue"),
        },
        {
          path: "clear-slot",
          component: () => import("../demos/ClearSlot.vue"),
        },
        {
          path: "icon-slots",
          component: () => import("../demos/IconSlots.vue"),
        },
        {
          path: "menu-positioning",
          component: () => import("../demos/MenuPositioning.vue"),
        },
        {
          path: "search-event",
          component: () => import("../demos/SearchEvent.vue"),
        },
        {
          path: "events",
          component: () => import("../demos/SelectEvents.vue"),
        },
      ],
    },
  ],
});
