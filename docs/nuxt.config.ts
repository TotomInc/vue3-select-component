import { fileURLToPath } from "node:url";

const libStyles = fileURLToPath(new URL("../src/styles.css", import.meta.url));

export default defineNuxtConfig({
  extends: ["docus"],

  vite: {
    resolve: {
      alias: {
        "vue3-select-component/styles": libStyles,
      },
    },
    optimizeDeps: {
      exclude: ["vue3-select-component"],
    },
    server: {
      watch: {
        ignored: ["!**/node_modules/vue3-select-component/dist/**"],
      },
    },
  },
});
