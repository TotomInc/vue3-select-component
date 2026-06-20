export default defineAppConfig({
  seo: {
    titleTemplate: "",
    title: "Vue 3 Select Component | Accessible Vue 3 Select",
    description:
      "Build accessible, type-safe select inputs in Vue 3. Use the batteries-included Select component or compose headless primitives for full UI control.",
  },

  github: {
    url: "https://github.com/TotomInc/vue3-select-component",
    branch: "v1-dev",
    rootDir: "docs",
  },

  ui: {
    colors: {
      primary: "sky",
      neutral: "neutral",
    },

    contentNavigation: {
      defaultVariants: {
        variant: "pill",
        highlight: false,
      },
    },
  },

  header: {
    title: "Vue3-Select-Component",
    logo: {
      light: "/logo.png",
      dark: "/logo.png",
      alt: "Vue3-Select-Component",
      favicon: "/favicon.ico",
    },
  },

  socials: {
    github: "https://github.com/TotomInc/vue3-select-component",
    x: "https://x.com/tcaweb",
  },
});
