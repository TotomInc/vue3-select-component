import { createRouter, createWebHistory } from "vue-router";

import { demoRoutes } from "../demo-routes";
import PlaygroundLayout from "../PlaygroundLayout.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: PlaygroundLayout,
      children: [
        { path: "", redirect: "/single" },
        ...demoRoutes.map(({ path, label, group, component }) => ({
          path,
          component,
          meta: { label, group },
        })),
      ],
    },
  ],
});
