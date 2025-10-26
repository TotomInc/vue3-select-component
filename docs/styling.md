---
title: 'Styling'
---

# Styling

Vue 3 Select Component provides multiple types of customization.

::: info
The component requires its CSS styles to be imported manually.

```javascript
import "vue3-select-component/styles";
```

You must import the styles in your application for the component to display correctly.
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
  --vs-option-focused-background-color: #dbeafe;
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

## Menu positioning data attribute

The dropdown menu automatically includes a `data-state-position` attribute that reflects the current position of the menu relative to the select control. This attribute is powered by [Floating UI](https://floating-ui.com/) and updates dynamically when the menu flips or adjusts its position to stay within the viewport.

::: tip
The component automatically adjusts the menu offset based on position. When the menu opens below (`bottom-*`), it uses `margin-top`, and when it opens above (`top-*`), it uses `margin-bottom` to maintain consistent spacing.
:::

### Available positions

The `data-state-position` attribute can have the following values:

- `bottom-start` - Default position, menu below the control aligned to the left
- `bottom-end` - Menu below the control aligned to the right
- `top-start` - Menu above the control aligned to the left (when flipped)
- `top-end` - Menu above the control aligned to the right (when flipped)
- Other [Floating UI placement values](https://floating-ui.com/docs/computeposition#placement)

### Styling based on position

You can use this data attribute to apply position-specific styles:

```css
/* Different border radius when menu opens upward */
.menu[data-state-position^="top"] {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.menu[data-state-position^="bottom"] {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* Add arrow indicator based on position */
.menu[data-state-position="bottom-start"]::before {
  content: "";
  position: absolute;
  top: -8px;
  left: 20px;
  border: 4px solid transparent;
  border-bottom-color: var(--vs-menu-background-color);
}

.menu[data-state-position="top-start"]::before {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 20px;
  border: 4px solid transparent;
  border-top-color: var(--vs-menu-background-color);
}
```

With TailwindCSS, you can use arbitrary values:

```vue
<VueSelect
  :classes="{
    menuContainer: '[&[data-state-position^=top]]:rounded-t-none [&[data-state-position^=bottom]]:rounded-b-none'
  }"
/>
```

## Custom classes with TailwindCSS

The component provides a `classes` prop that allows you to apply custom TailwindCSS classes to different parts of the select component. This is particularly useful when you want to customize the appearance without overriding the default CSS variables.

Here's an example of how to use TailwindCSS classes with the component:

```vue
<template>
  <VueSelect
    v-model="selected"
    :options="options"
    :classes="{
      container: 'w-full max-w-md',
      control: 'border-2 border-gray-200 hover:border-gray-300',
      valueContainer: 'p-2',
      placeholder: 'text-gray-400',
      singleValue: 'text-gray-800 font-medium',
      multiValue: 'bg-blue-100 rounded-md',
      multiValueLabel: 'text-blue-800 px-2 py-1',
      multiValueRemove: 'hover:bg-blue-200 px-2',
      inputContainer: 'p-1',
      searchInput: 'text-gray-700',
      menuContainer: 'mt-1 border border-gray-200 rounded-md shadow-lg',
      menuOption: 'px-3 py-2 hover:bg-gray-100',
      noResults: 'text-gray-500 p-3',
      taggableNoOptions: 'text-blue-600 p-3 hover:bg-blue-50',
    }"
  />
</template>
```

::: warning
When using TailwindCSS classes, be careful not to break the component's functionality by overriding essential styles like `display`, `position`, or `z-index` properties that are crucial for the component's layout and behavior.
:::

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

## Why styles cannot be automatically injected

Previously, the styles were automatically injected into the application's global scope. This was done to ensure that the styles were applied to the component's specific instance.

However, this approach was not compatible with strict Content Security Policy (CSP) environments.

To ensure compatibility with CSP environments, the styles should be imported manually.
