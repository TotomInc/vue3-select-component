import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // eslint-disable-next-line node/prefer-global/process
      reporters: process.env.CI ? "verbose" : "default",
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
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            include: [
              "lib/**/*.spec.ts",
              "composables/useSelectCollection.spec.ts",
              "index.spec.ts",
            ],
            exclude: ["lib/dom.spec.ts"],
            environment: "node",
          },
        },
        {
          extends: true,
          test: {
            name: "browser",
            include: [
              "assembled/**/*.spec.ts",
              "SelectRoot.spec.ts",
              "lib/dom.spec.ts",
              "composables/useSelectDismiss.spec.ts",
              "composables/useSelectKeyboard.spec.ts",
              "composables/useSelectState.spec.ts",
            ],
            setupFiles: ["vitest-browser-vue"],
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  }),
);
