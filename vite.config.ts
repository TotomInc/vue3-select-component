/// <reference types="vitest" />
import { URL, fileURLToPath } from "node:url";

import { type UserConfig, defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevtools from "vite-plugin-vue-devtools";
import dts from "vite-plugin-dts";
import cssInject from "vite-plugin-css-injected-by-js";

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
        target: "es2015",
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

  if (configEnv.mode.includes("playground")) {
    config.root = resolve("./playground");
  }

  return config;
});
