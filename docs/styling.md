---
title: 'Styling'
---

# Styling

Vue 3 Select Component provides 2 types of customization available in the component.

::: tip
The default component styling is already included with the VueSelect component, you don't need to import any CSS file to make it work.
:::

## CSS variables

CSS variables is the easiest way to customize the component style but provides less flexibility over your design. When importing the component, you will notice that CSS variables are injected into the `:root` scope and are prefixed with `--vs-select-[...]`.

For a complete list of CSS variables, we recommend to take a look at the source-code ([`/src/Select.vue`](https://github.com/TotomInc/vue3-select-component/blob/master/src/Select.vue)) or look at your DevTools when using the component _(open DevTools => `Elements` tab => pick `<html />` node => view all CSS variables inside the `:root` scope)_.

List of available CSS variables (pulled from the demo):

```css
:root {
  --vs-input-bg: #fff;
  --vs-input-outline: #3b82f6;
  --vs-input-placeholder-color: #52525b;

  --vs-padding: 0.25rem 0.5rem;
  --vs-border: 1px solid #e4e4e7;
  --vs-border-radius: 4px;
  --vs-font-size: 16px;
  --vs-font-weight: 400;
  --vs-font-family: inherit;
  --vs-text-color: #18181b;
  --vs-line-height: 1.5;

  --vs-menu-offset-top: 8px;
  --vs-menu-height: 200px;
  --vs-menu-padding: 0;
  --vs-menu-border: 1px solid #e4e4e7;
  --vs-menu-bg: #fff;
  --vs-menu-box-shadow: none;
  --vs-menu-z-index: 2;

  --vs-option-padding: 8px 12px;
  --vs-option-font-size: var(--vs-font-size);
  --vs-option-font-weight: var(--vs-font-weight);
  --vs-option-text-color: var(--vs-text-color);
  --vs-option-bg: var(--vs-menu-bg);
  --vs-option-hover-color: #dbeafe;
  --vs-option-focused-color: var(--vs-option-hover-color);
  --vs-option-selected-color: #93c5fd;
  --vs-option-disabled-color: #f4f4f5;
  --vs-option-disabled-text-color: #52525b;

  --vs-multi-value-gap: 0px;
  --vs-multi-value-padding: 4px;
  --vs-multi-value-margin: 4px 0px 4px 6px;
  --vs-multi-value-font-size: 14px;
  --vs-multi-value-font-weight: 400;
  --vs-multi-value-line-height: 1;
  --vs-multi-value-text-color: #3f3f46;
  --vs-multi-value-bg: #f4f4f5;
  --vs-multi-value-xmark-size: 16px;
  --vs-multi-value-xmark-color: var(--vs-multi-value-text-color);

  --vs-indicators-gap: 4px;
  --vs-icon-size: 20px;
  --vs-icon-color: var(--vs-text-color);

  --vs-dropdown-transition: transform 0.25s ease-out;
}
```

## Scoped styling inside SFC

You can apply any custom styling using [the `:deep` selector](https://vuejs.org/api/sfc-css-features.html#deep-selectors) inside a `<style scoped>`.

```vue
<style scoped>
:deep(.vue-select) {
  width: 320px;
}

:deep(.vue-select .menu-option) {
  background-color: #f4f4f5;
}
</style>
```
