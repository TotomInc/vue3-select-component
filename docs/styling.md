---
title: 'Styling'
---

# Styling

Vue 3 Select Component provides multiple types of customization.

::: tip
The default component styling is already included and bundled with the `<VueSelect />` component.
You don't need to import any other CSS file to make it work, by default.
:::

## CSS variables

Using CSS variables, it is possible to customize the component style easily _but_ this method provides less flexibility over your design. When importing the component, you will notice that CSS variables are injected into the `:root` scope and are prefixed with `--vs-[...]`.

For a complete list of CSS variables, we recommend to take a look at the source-code ([`/src/Select.vue`](https://github.com/TotomInc/vue3-select-component/blob/master/src/Select.vue)) or look at your DevTools _(open DevTools => `Elements` tab => pick `<html />` node => view all CSS variables inside the `:root` scope)_.

### List of CSS variables

```css
:root {
  --vs-width: 100%;
  --vs-min-height: 38px;
  --vs-padding: 4px 8px;
  --vs-border: 1px solid #e4e4e7;
  --vs-border-radius: 4px;
  --vs-font-size: 16px;
  --vs-font-weight: 400;
  --vs-font-family: inherit;
  --vs-text-color: #18181b;
  --vs-line-height: 1.5;
  --vs-placeholder-color: #52525b;
  --vs-background-color: #fff;
  --vs-disabled-background-color: #f4f4f5;
  --vs-outline-width: 1px;
  --vs-outline-color: #3b82f6;

  --vs-menu-offset-top: 8px;
  --vs-menu-height: 200px;
  --vs-menu-border: var(--vs-border);
  --vs-menu-background-color: var(--vs-background-color);
  --vs-menu-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --vs-menu-z-index: 2;

  --vs-option-width: 100%;
  --vs-option-padding: 8px 12px;
  --vs-option-cursor: pointer;
  --vs-option-font-size: var(--vs-font-size);
  --vs-option-font-weight: var(--vs-font-weight);
  --vs-option-text-align: -webkit-auto;
  --vs-option-text-color: var(--vs-text-color);
  --vs-option-hover-text-color: var(--vs-text-color);
  --vs-option-focused-text-color: var(--vs-text-color);
  --vs-option-selected-text-color: var(--vs-text-color);
  --vs-option-disabled-text-color: #52525b;
  --vs-option-background-color: var(--vs-menu-background);
  --vs-option-hover-background-color: #dbeafe;
  --vs-option-focused-background-color: var(--vs-option-hover-background-color);
  --vs-option-selected-background-color: #93c5fd;
  --vs-option-disabled-background-color: #f4f4f5;
  --vs-option-opacity-menu-open: 0.4;

  --vs-multi-value-margin: 2px;
  --vs-multi-value-border: 0px;
  --vs-multi-value-border-radius: 2px;
  --vs-multi-value-background-color: #f4f4f5;

  --vs-multi-value-label-padding: 4px 4px 4px 8px;
  --vs-multi-value-label-font-size: 12px;
  --vs-multi-value-label-font-weight: 400;
  --vs-multi-value-label-line-height: 1;
  --vs-multi-value-label-text-color: #3f3f46;

  --vs-multi-value-delete-padding: 0 3px;
  --vs-multi-value-delete-hover-background-color: #FF6467;
  --vs-multi-value-xmark-size: 16px;
  --vs-multi-value-xmark-cursor: pointer;
  --vs-multi-value-xmark-color: var(--vs-multi-value-label-text-color);
  --vs-multi-value-xmark-hover-color: #fff;

  --vs-indicators-gap: 0px;
  --vs-indicator-icon-size: 20px;
  --vs-indicator-icon-color: var(--vs-text-color);
  --vs-indicator-icon-cursor: pointer;
  --vs-indicator-dropdown-icon-transition: transform 0.2s ease-out;

  --vs-spinner-color: var(--vs-text-color);
  --vs-spinner-size: 16px;
}
```

### Editing CSS variables

Inside the SFC (`.vue`) that is using the `<VueSelect />` component, you can add a class to the component and edit the CSS variables to that class.

```vue
<template>
  <VueSelect class="custom-select" />
</template>

<style lang scoped>
.custom-select {
  --vs-border-radius: 12px;
  --vs-text-color: #334155;
}
</style>
```

You can also use the `:deep` selector to apply the CSS variables to the component's children if you prefer to no add a custom class:

```vue
<template>
  <VueSelect />
</template>

<style lang scoped>
:deep(.vue-select) {
  --vs-border-radius: 12px;
  --vs-text-color: #334155;
}
</style>
```

## Scoped styling inside SFC

You can apply any custom styling using [the `:deep` selector](https://vuejs.org/api/sfc-css-features.html#deep-selectors) inside a `<style scoped>`.

```vue
<template>
  <VueSelect />
</template>

<style scoped>
:deep(.vue-select) {
  width: 320px;
}

:deep(.vue-select .menu-option) {
  background-color: #f4f4f5;
}
</style>
```
