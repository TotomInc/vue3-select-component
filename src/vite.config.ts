import { existsSync } from "node:fs";
import { dirname, resolve as pathResolve, relative } from "node:path";
import { fileURLToPath, URL } from "node:url";
import dts from "unplugin-dts/vite";
import vue from "unplugin-vue/vite";
import { defineConfig } from "vite";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const rootDir = pathResolve(fileURLToPath(new URL(".", import.meta.url)));
const outDir = pathResolve(rootDir, "dist");
// eslint-disable-next-line node/prefer-global/process
const isWatchMode = process.argv.includes("--watch");

const relativeSpecifierRE = /(\bfrom\s+|\bimport\s*\(\s*|^\s*import\s+)(["'])(\.{1,2}(?:\/[^"']*)?)\2/gm;

/**
 * The package is `"type": "module"`, so under `moduleResolution: node16/nodenext`
 * TypeScript requires explicit extensions on relative imports in `.d.ts` files.
 * Rewrite `./foo` to `./foo.js` and `./dir` to `./dir/index.js`, resolved against
 * the source tree (`dist/` mirrors `src/`). Also valid under `bundler` resolution.
 */
function addDtsExtensions(filePath: string, content: string): string {
  const sourceDir = pathResolve(rootDir, relative(outDir, dirname(filePath)));

  return content.replace(relativeSpecifierRE, (match, prefix: string, quote: string, specifier: string) => {
    if (/\.(?:js|mjs|cjs|json)$/.test(specifier)) {
      return match;
    }

    const target = pathResolve(sourceDir, specifier);
    const isFile = [".ts", ".vue", ".d.ts"].some((ext) => existsSync(`${target}${ext}`));
    const isDirectory = !isFile && [".ts", ".vue"].some((ext) => existsSync(pathResolve(target, `index${ext}`)));

    if (!isFile && !isDirectory) {
      throw new Error(`[dts] Cannot resolve "${specifier}" from ${filePath}`);
    }

    const base = specifier.replace(/\/$/, "");
    const suffix = isFile ? ".js" : "/index.js";
    return `${prefix}${quote}${base}${suffix}${quote}`;
  });
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      processor: "vue",
      tsconfigPath: "tsconfig.build.json",
      cleanVueFileName: true,
      beforeWriteFile: (filePath, content) => {
        if (filePath.endsWith(".d.ts")) {
          return {
            content: addDtsExtensions(filePath, content),
          };
        }
      },
    }),
  ],

  resolve: {
    alias: {
      "@": rootDir,
    },
  },

  build: {
    emptyOutDir: !isWatchMode,
    target: "es2022",
    lib: {
      name: "vue3-select-component",
      entry: {
        index: resolve("./index.ts"),
        primitives: resolve("./primitives/index.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => entryName === "index"
        ? `index.${format}.js`
        : `${entryName}.js`,
    },
    rollupOptions: {
      external: (id) => id === "vue" || id.startsWith("vue/") || id.startsWith("@vue/"),
    },
  },
});
