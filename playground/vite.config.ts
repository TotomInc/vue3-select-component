import { fileURLToPath, URL } from "node:url";
import vue from "unplugin-vue/vite";
import { defineConfig } from "vite";

const srcDir = fileURLToPath(new URL("../src", import.meta.url));

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      "@": srcDir,
      "vue3-select-component/primitives": `${srcDir}/primitives/index.ts`,
      "vue3-select-component/styles": `${srcDir}/styles.css`,
      "vue3-select-component": `${srcDir}/index.ts`,
    },
  },

  server: {
    port: 5174,
    open: true,
  },
});
