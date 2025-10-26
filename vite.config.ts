import type { UserConfig } from "vite";

import { resolve as pathResolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import vueDevtools from "vite-plugin-vue-devtools";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig((configEnv) => {
  // Default config shared config by all modes.
  const config: UserConfig = {
    plugins: [vue()],

    resolve: {
      alias: {
        "@": pathResolve(__dirname, "./src"),
      },
    },
  };

  // Build library when in production mode (npm run build).
  if (configEnv.mode === "production") {
    return {
      ...config,

      plugins: [
        ...config.plugins!,
        dts({ tsconfigPath: "tsconfig.build.json", cleanVueFileName: true }),
      ],

      build: {
        // Official @vue/tsconfig compiles down to ES2020, let's do the same.
        // See: https://github.com/vuejs/tsconfig/blob/main/tsconfig.dom.json
        target: "es2020",
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
            // Change default name of the .css file built.
            assetFileNames: (assetInfo) => {
              if (assetInfo.names.includes("vue3-select-component.css")) {
                return "styles.css";
              }

              return assetInfo.names[0];
            },
          },
        },
      },
    };
  }

  if (["development", "development:playground"].includes(configEnv.mode)) {
    config.plugins!.push(vueDevtools());
  }

  if (configEnv.mode === "development:playground") {
    config.root = resolve("./playground");
  }

  return config;
});
