import { resolve as pathResolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";
import vue from "unplugin-vue/vite";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    dts({
      processor: "vue",
      tsconfigPath: "tsconfig.build.json",
      cleanVueFileName: true,
    }),
  ],

  resolve: {
    alias: {
      "@": pathResolve(__dirname, "./src"),
    },
  },

  build: {
    target: "es2022",
    lib: {
      name: "vue3-select-component",
      entry: resolve("./src/index.ts"),
      formats: ["es"],
      fileName: (format) => `index.${format}.js`,
    },
  },
});
