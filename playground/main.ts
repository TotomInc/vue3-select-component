import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import ControlledMenu from "./demos/ControlledMenu.vue";
import CustomOptionLabelValue from "./demos/CustomOptionLabelValue.vue";
import CustomPlaceholder from "./demos/CustomPlaceholder.vue";
import CustomSearchFilter from "./demos/CustomSearchFilter.vue";
import CustomTagContent from "./demos/CustomTagContent.vue";
import ExtraOptionProperties from "./demos/ExtraOptionProperties.vue";
import KeyboardNavigation from "./demos/KeyboardNavigation.vue";
import MenuHeader from "./demos/MenuHeader.vue";
import MenuPositioning from "./demos/MenuPositioning.vue";
import MultiSelect from "./demos/MultiSelect.vue";
import MultiSelectTaggable from "./demos/MultiSelectTaggable.vue";
import NoSelectOnBlur from "./demos/NoSelectOnBlur.vue";
import SearchEvent from "./demos/SearchEvent.vue";
import SelectIsLoading from "./demos/SelectIsLoading.vue";
import SingleSelect from "./demos/SingleSelect.vue";
import TaggableNoOptionsSlot from "./demos/TaggableNoOptionsSlot.vue";
import PlaygroundLayout from "./PlaygroundLayout.vue";
import "vue3-select-component/styles";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/single-select" },
    { path: "/single-select", component: SingleSelect },
    { path: "/multi-select", component: MultiSelect },
    { path: "/multi-select-taggable", component: MultiSelectTaggable },
    { path: "/custom-placeholder", component: CustomPlaceholder },
    { path: "/custom-tag-content", component: CustomTagContent },
    { path: "/extra-option-properties", component: ExtraOptionProperties },
    { path: "/custom-option-label-value", component: CustomOptionLabelValue },
    { path: "/custom-search-filter", component: CustomSearchFilter },
    { path: "/select-is-loading", component: SelectIsLoading },
    { path: "/no-select-on-blur", component: NoSelectOnBlur },
    { path: "/taggable-no-options-slot", component: TaggableNoOptionsSlot },
    { path: "/controlled-menu", component: ControlledMenu },
    { path: "/menu-header", component: MenuHeader },
    { path: "/menu-positioning", component: MenuPositioning },
    { path: "/keyboard-navigation", component: KeyboardNavigation },
    { path: "/search-event", component: SearchEvent },
  ],
});

createApp(PlaygroundLayout).use(router).mount("#app");
