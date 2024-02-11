import antfu from "@antfu/eslint-config";

export default antfu({
  vue: true,
  typescript: true,

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
