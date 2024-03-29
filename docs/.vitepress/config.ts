import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vue 3 Select Component",
  description: "A performant & accessible Select component for Vue 3. Best in class Selecting solution for Vue 3.",

  head: [
    ["script", {}, `window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`],
    ["script", { src: "/_vercel/insights/script.js", defer: "true" }],
  ],

  sitemap: {
    hostname: "https://vue3-select-component.vercel.app",
  },

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/getting-started" },
      { text: "Demo", link: "/demo/single-select" },
    ],

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
        ],
      },
      {
        text: "Demo",
        items: [
          { text: "Single Select", link: "/demo/single-select" },
          { text: "Multiple Select", link: "/demo/multiple-select" },
          { text: "Custom Option Slot", link: "/demo/custom-option-slot" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/TotomInc/vue3-select-component" },
    ],
  },
});
