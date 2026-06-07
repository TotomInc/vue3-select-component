import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "happy-dom",
      coverage: {
        provider: "v8",
        include: ["**/*.vue", "**/*.ts"],
        exclude: ["test-utils/**", "**/*.spec.ts", "**/*.test.ts"],
      },
    },
  }),
);
