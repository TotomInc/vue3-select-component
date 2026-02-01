import { execSync } from "node:child_process";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue 3 Select Component",
  description: "A performant & accessible Select component for Vue 3. Best in class Selecting solution for Vue 3.",
  // Remove trailing .html from URLs. This is suppored by default on Vercel.
  cleanUrls: true,

  head: [
    ["link", { rel: "icon", type: "image/png", href: "/favicon.png" }],
    ["meta", { name: "google-site-verification", content: "qv0rGOlwG3_UHi5HWsY3NtpsLZHcQ79xQHAgH2q_1WA" }],
    ["script", { "src": "https://cloud.umami.is/script.js", "data-website-id": "8fb344f7-10d2-44d7-bdc7-d8a4952b91c5", "defer": "true" }],
  ],

  sitemap: {
    hostname: "https://vue3-select-component.vercel.app",
  },

  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/getting-started" },
      { text: "Demo", link: "/demo/single-select" },
      { text: "Playground", rel: "noopener noreferrer", target: "_blank", link: "/playground" },
      { text: "Bug repro", link: "https://play.vuejs.org/#eNqlVE1v00AQ/SurvaRIsa0SuIQ0CqAe6AFQU3HBCDn2xHG63l3th52Q+L8zu3ZSp02rIi6Wd+btzJv3xt7Rj1KGlQU6phOdqkIaosFYSVjC86uYGh3TacyLUgplyI4oWJKGLJUoSUzxXkw/HLM/LMyBQWp6+VGgfShIBYI4cONvxDwVXBtSJcwCuXJlJ9qogudkT7hlbHrhnm8QOolaXsgCDwZKyRIDeCJk8tDRHQmpglJkwJC3LxzTNjwW0hTYD+M/2wjBUViyADYmg5ukSua+xWDYEsLgWg9IM3wKvttKeAI2z4Bvre7DlDueBc7rYtlHan8+Qn8dBsHRU1gJloHCWbrREyKVyFVSlk4+55tN8m72yKuGSslpi4aMtGIceu12nQn7PTrG0aKYkqaZRBKvTqKe3njUZsvc66xz3Cp2EdOVMVKPo6iu69ByeZ+HaHZ01vyZq6VNlBX48NV0mGrcMed0zBci25KdI7wU3AS6+IMML9/KDWYbvwqeAB3SlkBQJjJca8Fxff21uEtgRRytFa3b0zG+HJimGcdruClFpUIOJuKyjGYIi5TlpighyER5wrUXD0GXwUKJWoPCKjHtXPJ9IgxWoAIFHE0C9dq+j66d6nSae7H/ue+tz+BfPSqw5wY7vqJR5+f/9evvhOuGrjdot9H4v1gW+SOzXY2CgfrWft8npieMifrGx4yycOSeriC9PxNf601L/bsCr3hvXpOoHDolr+dfYYPvxyT+cizrFuyZ5C1owazj2MI+WZ4h7R7Os/3idxe/4jt9vTHA9WEoR9Sr4fFe/88vjP5AdxS+66n4G9fI1UQBR+H78HJEm7+WbQti" },
      { text: "Changelog", link: "https://github.com/TotomInc/vue3-select-component/releases" },
    ],

    footer: {
      copyright: "Released under the MIT License.",
    },

    sidebar: [
      {
        text: "Documentation",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Options", link: "/options" },
          { text: "Props", link: "/props" },
          { text: "Slots", link: "/slots" },
          { text: "Events", link: "/events" },
          { text: "Styling", link: "/styling" },
          { text: "Accessibility", link: "/accessibility" },
          { text: "TypeScript Guide", link: "/typescript" },
        ],
      },
      {
        text: "Demo links",
        items: [
          { text: "Single select", link: "/demo/single-select" },
          { text: "Multiple Select", link: "/demo/multiple-select" },
          { text: "Multiple Select Taggable", link: "/demo/multiple-select-taggable" },
          { text: "Custom option slot", link: "/demo/custom-option-slot" },
          { text: "Custom tag slot", link: "/demo/custom-tag-slot" },
          { text: "Custom tag-content slot", link: "/demo/custom-tag-content-slot" },
          { text: "Custom value mapping", link: "/demo/custom-value-mapping" },
          { text: "Dropdown menu header", link: "/demo/dropdown-menu-header" },
          { text: "Custom displayed options", link: "/demo/custom-displayed-options" },
          { text: "Controlled menu", link: "/demo/controlled-menu" },
          { text: "Pre-selected values", link: "/demo/pre-selected-values" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Input attributes", link: "/guides/input-attributes" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/TotomInc/vue3-select-component" },
      { icon: "npm", link: "https://www.npmjs.com/package/vue3-select-component" },
    ],

    search: {
      provider: "algolia",
      options: {
        appId: "ZOB728VULQ",
        apiKey: "0ef0bfc5f328b473061642ab4c730a3b",
        indexName: "vue3-select-component",
      },
    },

    outline: "deep",
  },

  async buildEnd(siteConfig) {
    execSync("npm run build:playground", { cwd: siteConfig.root, stdio: "inherit" });
  },
});
