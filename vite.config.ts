import { URL, fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevtools from "vite-plugin-vue-devtools";
import dts from "vite-plugin-dts";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevtools(),
    dts({
      tsconfigPath: "tsconfig.build.json",
      cleanVueFileName: true,
    }),
  ],

  resolve: {
    alias: {
      "@": resolve("./src"),
    },
  },

  build: {
    target: "es2015",
    lib: {
      name: "vue3-select-component",
      entry: resolve("./src/index.ts"),
      formats: ["es", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: { vue: "Vue" },
      },
    },
  },
});
