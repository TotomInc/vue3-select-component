import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default defineConfig((configEnv) => mergeConfig(
  viteConfig(configEnv),
  defineConfig({
    test: {
      environment: "happy-dom",
      coverage: {
        provider: "v8",
        include: ["src/**/*.vue", "src/**/*.ts"],
      },
    },
  }),
));
