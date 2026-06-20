import type { Awaitable, TypedFlatConfigItem } from "@antfu/eslint-config";
import antfu from "@antfu/eslint-config";

export function createEslintConfig(additionalIgnores: string[] = []): Awaitable<TypedFlatConfigItem[]> {
  return antfu({
    vue: true,
    typescript: true,

    ignores: [
      "**/.data",
      "**/.nuxt",
      "**/.output",
      "**/dist",
      "docs/content",
      "pnpm-workspace.yaml",
      ".agents/**",
      ...additionalIgnores,
    ],

    stylistic: {
      indent: 2,
      jsx: false,
      quotes: "double",
      semi: true,
    },

    rules: {
      "curly": ["error", "multi-line"],
      "antfu/top-level-function": "off",
      "ts/consistent-type-definitions": ["error", "type"],
      "vue/max-attributes-per-line": ["error", { singleline: 2, multiline: 1 }],
      "style/arrow-parens": ["error", "always"],
    },
  });
}

export default createEslintConfig();
