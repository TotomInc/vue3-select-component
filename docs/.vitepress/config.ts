import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue 3 Select Component",
  description: "A performant & accessible Select component for Vue 3. Best in class Selecting solution for Vue 3.",

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
          { text: "Dropdown Options", link: "/dropdown-options" },
          { text: "Props", link: "/props" },
          { text: "Slots", link: "/slots" },
          { text: "Events", link: "/events" },
          { text: "Styling", link: "/styling" },
          { text: "TypeScript", link: "/typescript" },
        ],
      },
      {
        text: "Demo links",
        items: [
          { text: "Single select", link: "/demo/single-select" },
          { text: "Multiple Select", link: "/demo/multiple-select" },
          { text: "Custom option slot", link: "/demo/custom-option-slot" },
          { text: "Custom tag slot", link: "/demo/custom-tag-slot" },
          { text: "Custom value/label properties", link: "/demo/custom-option-label-value" },
          { text: "Pre-selected values", link: "/demo/pre-selected-values" },
          { text: "Disabled options", link: "/demo/disabled-options" },
          { text: "With menu-header", link: "/demo/with-menu-header" },
          { text: "With complex menu filter", link: "/demo/with-complex-menu-filter.md" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/TotomInc/vue3-select-component" },
      { icon: "npm", link: "https://www.npmjs.com/package/vue3-select-component" },
    ],

    search: { provider: "local" },

    outline: "deep",
  },
});
