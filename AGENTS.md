## Learned User Preferences

- Playground demos should be separate Vue components per test case so manual regression testing stays easy when changing the select.
- Docs use simple, short phrasing (about one to two sentences per section); avoid em-dash and semicolon-heavy prose.
- Interactive docs demos must use `ClientOnly` or `.client` component suffixes to prevent hydration errors.
- Do not add v0-to-v1 migration shims or v0 prop aliases in v1 code; document breaking changes in docs only.
- New primitives API (slots, icons, clear button, empty state, etc.) should be exposed on assembled `Select` where it makes sense.
- When teleport-related unit tests stay flaky after reasonable effort, remove the blocking test and revisit later rather than blocking delivery.
- Prefer correcting default behavior over adding opt-in props when fixing reported UX issues.
- Behavior and composable fixes should cover both primitives and assembled `Select`, with tests.
- ESLint shared config and consumer configs should be TypeScript (`eslint.config.ts`), not JavaScript; use ESLint native TS support with `jiti` on Node.

## Learned Workspace Facts

- v1 is a headless select: low-level building blocks in `src/primitives/` and a batteries-included layer in `src/assembled/Select.vue`.
- The repo is a pnpm workspace with `eslint-config` (shared ESLint), `src` (library), `docs` (Docus/Nuxt), and `playground` (Vite dev server only).
- Shared ESLint config lives in `@vue3-select-component/eslint-config`; packages consume it via local `eslint.config.ts` files (with `jiti`).
- Docs and playground consume the library through workspace package linking to built `dist/`, not fragile source aliases.
- Dropdown positioning uses Reka UI Popover with teleport-to-body as the default for assembled and primitive selects.
- The library is built with Vite, unplugin, and unplugin-dts.
- Docs deploy as static SSG via `nuxt generate`; Vercel output directory is `docs/.vercel/output/static`.
- Complex use cases (virtualized lists, infinite scroll, remote data) are primitives recipes in the guide, not assembled `Select` APIs.
- Assembled `Select` defaults `searchable` to `true`.
- v0 maintenance lives on the `v0` branch with its own Vercel site; active v1 development is on `v1-dev`.
