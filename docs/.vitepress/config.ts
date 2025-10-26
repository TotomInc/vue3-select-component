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
      { text: "Playground", link: "https://play.vuejs.org/#eNqNU01v2zAM/SuCLtmA2MaQ7ZK5Qbehh/WwDU2xyzwMqs04TmVJ0IedIfF/HyU7qZOmxS6GRT3yPT5SO/pJqbhxQOc0NbmulCUGrFOEM1FeZdSajC4yUdVKakt2RMOKdGSlZU0yinkZ/Xi8/elgCRxyO7qfRSaEolwiSICwISMTuRTGkoZxB+TKl02N1ZUoyZ4Ix/nijf++RWia9LpQBR4s1IozC3giJH1i9EdCmqiWBXDUHQpntA/PpbIV8mH8Vx8h2ApnD8DnZHLLGrYMFJNpLwiDGzMh3fQ5+P6vgmdg+wL4zpkxTPvjReCyrVZjpAnnI/T3oRFsPYe15AVo7GVonRGlZalZXXv7/NwcK4fek+AaOqUWPRoK0ptx4NrthiHs9zgxgSPKKOm6NFGYmiYjv+mU9oOOaqbijZECl2bnq2fDBe4KFuylDtsxx5+1tcrMkyQvBKbhfKpGxwJsIlSdXCMs0U7YqoaokPW1ZzM2KSr8jOIxmDp60LI1oLFKRgdvAk+CwQZ0pEGgNaD/l/cs7YT77O5V/ktbPlbQtm3shHosYwQkFxNOuCvk3CJjIPI8XSY69N8afDarqjxz3xepOOjv/ZqfTIFxLtvbELPawVF1vob88UJ8Y7a99h8aggWjTi3TJQyt3Sy/wRb/j5f48hwfJv7C5R0YyZ3X2MM+O1Gg7BEuqP0algmX+d7cbC0Ic2jKCw1uBHxw/ssrrT/JncXvRy7+wbn6mmjgLP4Qv5vR7h/FnLCQ" },
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
});
