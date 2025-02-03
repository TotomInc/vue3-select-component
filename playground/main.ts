import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import MultiSelect from "./demos/MultiSelect.vue";
import MultiSelectTaggable from "./demos/MultiSelectTaggable.vue";
import SingleSelect from "./demos/SingleSelect.vue";
import TaggableNoOptionsSlot from "./demos/TaggableNoOptionsSlot.vue";
import SelectIsLoading from "./demos/SelectIsLoading.vue";
import CustomOptionLabelValue from "./demos/CustomOptionLabelValue.vue"
import ExtraOptionProperties from "./demos/ExtraOptionProperties.vue"
import PlaygroundLayout from "./PlaygroundLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/single-select" },
    { path: "/single-select", component: SingleSelect },
    { path: "/multi-select", component: MultiSelect },
    { path: "/multi-select-taggable", component: MultiSelectTaggable },
    { path: "/extra-option-properties", component: ExtraOptionProperties },
    { path: "/custom-option-label-value", component: CustomOptionLabelValue },
    { path: "/select-is-loading", component: SelectIsLoading },
    { path: "/taggable-no-options-slot", component: TaggableNoOptionsSlot },
  ],
});

createApp(PlaygroundLayout).use(router).mount("#app");
