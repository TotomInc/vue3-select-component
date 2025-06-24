import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import ControlledMenu from "./demos/ControlledMenu.vue";
import CustomMenuContainer from "./demos/CustomMenuContainer.vue";
import CustomMenuOption from "./demos/CustomMenuOption.vue";
import CustomOptionLabelValue from "./demos/CustomOptionLabelValue.vue";
import CustomPlaceholder from "./demos/CustomPlaceholder.vue";
import CustomSearchFilter from "./demos/CustomSearchFilter.vue";
import InfiniteScroll from "./demos/InfiniteScroll.vue";
import MenuHeader from "./demos/MenuHeader.vue";
import MultiSelect from "./demos/MultiSelect.vue";
import MultiSelectTaggable from "./demos/MultiSelectTaggable.vue";
import SelectIsLoading from "./demos/SelectIsLoading.vue";
import SingleSelect from "./demos/SingleSelect.vue";
import TaggableNoOptionsSlot from "./demos/TaggableNoOptionsSlot.vue";
import PlaygroundLayout from "./PlaygroundLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/single-select" },
    { path: "/single-select", component: SingleSelect },
    { path: "/multi-select", component: MultiSelect },
    { path: "/multi-select-taggable", component: MultiSelectTaggable },
    { path: "/custom-placeholder", component: CustomPlaceholder },
    { path: "/custom-menu-container", component: CustomMenuContainer },
    { path: "/custom-menu-option", component: CustomMenuOption },
    { path: "/custom-option-label-value", component: CustomOptionLabelValue },
    { path: "/custom-search-filter", component: CustomSearchFilter },
    { path: "/select-is-loading", component: SelectIsLoading },
    { path: "/taggable-no-options-slot", component: TaggableNoOptionsSlot },
    { path: "/controlled-menu", component: ControlledMenu },
    { path: "/menu-header", component: MenuHeader },
    { path: "/infinite-scroll", component: InfiniteScroll },
  ],
});

createApp(PlaygroundLayout).use(router).mount("#app");
