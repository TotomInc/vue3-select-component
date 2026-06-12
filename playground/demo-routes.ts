import type { Component } from "vue";

export type DemoGroup = "Basics" | "Behavior" | "Customization";

export type DemoRoute = {
  path: string;
  label: string;
  group: DemoGroup;
  component: () => Promise<{ default: Component }>;
};

export const demoGroups: DemoGroup[] = ["Basics", "Behavior", "Customization"];

export const demoRoutes: DemoRoute[] = [
  {
    path: "single",
    label: "Single select",
    group: "Basics",
    component: () => import("./demos/SingleSelect.vue"),
  },
  {
    path: "multi",
    label: "Multi select",
    group: "Basics",
    component: () => import("./demos/MultiSelect.vue"),
  },
  {
    path: "searchable",
    label: "Searchable",
    group: "Basics",
    component: () => import("./demos/SearchableSelect.vue"),
  },
  {
    path: "clearable",
    label: "Clearable",
    group: "Basics",
    component: () => import("./demos/ClearableSelect.vue"),
  },
  {
    path: "disabled",
    label: "Disabled",
    group: "Basics",
    component: () => import("./demos/DisabledSelect.vue"),
  },
  {
    path: "disabled-options",
    label: "Disabled options",
    group: "Basics",
    component: () => import("./demos/DisabledOptions.vue"),
  },
  {
    path: "loading",
    label: "Loading",
    group: "Basics",
    component: () => import("./demos/LoadingSelect.vue"),
  },
  {
    path: "pre-selected",
    label: "Pre-selected",
    group: "Basics",
    component: () => import("./demos/PreSelected.vue"),
  },
  {
    path: "close-on-select",
    label: "Close on select",
    group: "Behavior",
    component: () => import("./demos/MultiCloseOnSelect.vue"),
  },
  {
    path: "hide-selected",
    label: "Hide selected",
    group: "Behavior",
    component: () => import("./demos/HideSelected.vue"),
  },
  {
    path: "search-event",
    label: "Search event",
    group: "Behavior",
    component: () => import("./demos/SearchEvent.vue"),
  },
  {
    path: "events",
    label: "Events",
    group: "Behavior",
    component: () => import("./demos/SelectEvents.vue"),
  },
  {
    path: "custom-mapping",
    label: "Custom option mapping",
    group: "Customization",
    component: () => import("./demos/CustomOptionMapping.vue"),
  },
  {
    path: "custom-filter",
    label: "Custom filter",
    group: "Customization",
    component: () => import("./demos/CustomFilter.vue"),
  },
  {
    path: "no-options-slot",
    label: "No options slot",
    group: "Customization",
    component: () => import("./demos/NoOptionsSlot.vue"),
  },
  {
    path: "create-item",
    label: "Create item",
    group: "Behavior",
    component: () => import("./demos/CreateItem.vue"),
  },
  {
    path: "tag-remove-slot",
    label: "Tag remove slot",
    group: "Customization",
    component: () => import("./demos/TagRemoveSlot.vue"),
  },
  {
    path: "clear-slot",
    label: "Clear slot",
    group: "Customization",
    component: () => import("./demos/ClearSlot.vue"),
  },
  {
    path: "icon-slots",
    label: "Icon slots",
    group: "Customization",
    component: () => import("./demos/IconSlots.vue"),
  },
  {
    path: "grouped-primitives",
    label: "Grouped primitives",
    group: "Customization",
    component: () => import("./demos/GroupedPrimitives.vue"),
  },
  {
    path: "menu-positioning",
    label: "Menu positioning",
    group: "Customization",
    component: () => import("./demos/MenuPositioning.vue"),
  },
];
