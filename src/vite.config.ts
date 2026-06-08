import { resolve as pathResolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import dts from "unplugin-dts/vite";
import vue from "unplugin-vue/vite";
import { defineConfig } from "vite";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const rootDir = pathResolve(fileURLToPath(new URL(".", import.meta.url)));

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
      "@": rootDir,
    },
  },

  build: {
    target: "es2022",
    lib: {
      name: "vue3-select-component",
      entry: {
        index: resolve("./index.ts"),
        primitives: resolve("./primitives/index.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => entryName === "index" ? `index.${format}.js` : `${entryName}.js`,
    },
    rollupOptions: {
      external: id => id === "vue" || id.startsWith("vue/") || id.startsWith("@vue/"),
    },
  },
});
