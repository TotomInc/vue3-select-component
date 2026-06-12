import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

const stylesEntry = fileURLToPath(new URL("./styles.css", import.meta.url));

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    cssMinify: true,
    rollupOptions: {
      input: stylesEntry,
      output: {
        assetFileNames: "styles.css",
      },
    },
  },
});
