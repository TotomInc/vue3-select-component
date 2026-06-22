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
        exclude: [
          "dist/**",
          "**/*.d.ts",
          "test-utils/**",
          "**/*.spec.ts",
          "**/*.test.ts",
          "vite*.config.ts",
        ],
      },
    },
  }),
);
