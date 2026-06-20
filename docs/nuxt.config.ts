/* eslint-disable node/prefer-global/process */
import { fileURLToPath } from "node:url";

import libPackage from "../src/package.json";

const libStyles = fileURLToPath(new URL("../src/styles.css", import.meta.url));

const siteUrl = process.env.NUXT_SITE_URL ?? "https://vue3-select-component.vercel.app";

export default defineNuxtConfig({
  extends: ["docus"],

  modules: ["@vercel/analytics"],

  site: {
    name: "Vue 3 Select Component",
    url: siteUrl,
    description:
      "Accessible, type-safe select inputs for Vue 3 with a batteries-included Select component and headless primitives.",
    defaultLocale: "en",
  },

  llms: {
    domain: siteUrl,
    title: "Vue 3 Select Component",
    description:
      "Documentation for vue3-select-component: assembled Select, headless primitives, API reference, and guides.",
    full: {
      title: "Vue 3 Select Component Documentation",
      description:
        "Complete documentation for building accessible select inputs in Vue 3 with assembled Select or composable primitives.",
    },
  },

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
