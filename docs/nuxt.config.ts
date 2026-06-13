import { fileURLToPath } from "node:url";

import libPackage from "../src/package.json";

const libStyles = fileURLToPath(new URL("../src/styles.css", import.meta.url));

export default defineNuxtConfig({
  extends: ["docus"],

  modules: ['@vercel/analytics'],

  // Static deploy serves files from .vercel/output/static only, so Vercel Image
  // Optimization (/_vercel/image) is unavailable. Use direct public asset URLs.
  image: {
    provider: "none",
  },

  runtimeConfig: {
    public: {
      packageVersion: libPackage.version,
    },
  },

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
