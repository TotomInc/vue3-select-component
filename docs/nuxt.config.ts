export default defineNuxtConfig({
  extends: ["docus"],

  vite: {
    optimizeDeps: {
      exclude: ["vue3-select-component"],
    },
    server: {
      watch: {
        ignored: ["!**/node_modules/vue3-select-component/dist/**"],
      },
    },
  },
});
