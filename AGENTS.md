# Playground demo guidelines

These guidelines keep playground demos consistent, readable, and easy to maintain.

## Structure and components
- Build demos with the shared components in `playground/components`.
- Prefer `DemoLayout` + `DemoHeader` + `DemoPanel` + `DemoSection` for page structure.
- Use `DemoValue`, `DemoInlineCode`, `DemoTag`, `DemoPill`, `DemoCard`, `DemoKbd` for shared UI patterns.

## Styling
- Use Tailwind utility classes for all layout and styling work.
- Avoid adding new CSS in demo files.
- Only add scoped CSS when Tailwind cannot target deep selectors (for example menu positioning with `::deep`).
- Keep `playground/styles.css` for base tokens and global resets only.

## Demo content
- Include a clear title, short description, and a visible result state.
- Keep text concise and product-focused; prefer short sentences and direct guidance.
- Use realistic option data that supports the demo behavior.

## Implementation notes
- Keep demo logic minimal and scoped to the feature.
- Avoid `any` or `@ts-ignore`; use existing types in `src/types`.
- Prefer composable patterns and small template sections for readability.

## Adding a new demo
1. Create a demo in `playground/demos`.
2. Import and use the shared components.
3. Register the route in `playground/main.ts`.
4. Add a link in `playground/PlaygroundLayout.vue`.
