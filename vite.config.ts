/// <reference types="vitest" />
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig, type UserConfig } from "vite";
import cssInject from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";
import vueDevtools from "vite-plugin-vue-devtools";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  // Default config shared config by all modes.
  const config: UserConfig = {
    plugins: [vue()],
    resolve: { alias: { "@": resolve("./src") } },
  };

  // When running vitest, add the test config.
  if (configEnv.mode === "test") {
    config.test = {
      environment: "happy-dom",
      coverage: {
        provider: "v8",
        include: ["src/**/*.vue", "src/**/*.ts"],
      },
    };
  }

  // Build library when in production mode (npm run build).
  if (configEnv.mode === "production") {
    return {
      ...config,

      plugins: [
        ...config.plugins!,
        cssInject(),
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
          output: { globals: { vue: "Vue" } },
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
