---
title: 'Custom tag content slot'
---

# Custom tag content slot

The following example demonstrates how to use the `VueSelect` component with the `#tag-content` slot when using the `isMulti` prop.

## What is the `#tag-content` slot?

The `#tag-content` slot allows you to customize only the text content inside a multi-select tag, while automatically preserving:

- The tag wrapper structure
- Default styling (background, padding, borders)
- The remove button
- Event handlers for removing tags

This makes it much simpler than the `#tag` slot when you only want to change how the label text is displayed.

## When to use `#tag-content` vs `#tag`

### Use `#tag-content` when:
- You only want to format or transform the label text
- You want to add icons, badges, or emphasis to the text
- You want to keep the default tag styling and remove button

### Use `#tag` when:
- You need complete control over the tag structure
- You want custom styling that can't be achieved with CSS variables
- You need to change the remove button appearance or behavior

::: info
Read more about available [slots here](../slots.md), the `#tag` slot [here](./custom-tag-slot.md), and the `isMulti` prop [here](../props.md#isMulti).
:::

<script setup>
import { ref } from "vue";
import VueSelect from "../../src";

const selected = ref([]);

const skillOptions = [
  { label: "JavaScript", value: "javascript", level: "expert", icon: "🟨" },
  { label: "TypeScript", value: "typescript", level: "expert", icon: "🔷" },
  { label: "Vue.js", value: "vue", level: "expert", icon: "💚" },
  { label: "React", value: "react", level: "intermediate", icon: "⚛️" },
  { label: "Python", value: "python", level: "beginner", icon: "🐍" },
  { label: "Rust", value: "rust", level: "beginner", icon: "🦀" },
];

const levelColors = {
  beginner: "#93c5fd",
  intermediate: "#86efac",
  expert: "#fde047",
};
</script>

<ClientOnly>
  <VueSelect
    v-model="selected"
    :is-multi="true"
    :options="skillOptions"
    placeholder="Select your skills"
  >
    <template #tag-content="{ option }">
      <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
        <span>{{ option.icon }}</span>
        <strong>{{ option.label }}</strong>
        <span
          :style="{
            fontSize: '10px',
            padding: '2px 4px',
            borderRadius: '2px',
            backgroundColor: levelColors[option.level],
            color: '#000',
            fontWeight: 500,
          }"
        >
          {{ option.level }}
        </span>
      </span>
    </template>
  </VueSelect>
</ClientOnly>

## Demo source-code

```vue
<script setup>
import { ref } from "vue";
import VueSelect from "vue3-select-component";

const selected = ref([]);

const skillOptions = [
  { label: "JavaScript", value: "javascript", level: "expert", icon: "🟨" },
  { label: "TypeScript", value: "typescript", level: "expert", icon: "🔷" },
  { label: "Vue.js", value: "vue", level: "expert", icon: "💚" },
  { label: "React", value: "react", level: "intermediate", icon: "⚛️" },
  { label: "Python", value: "python", level: "beginner", icon: "🐍" },
  { label: "Rust", value: "rust", level: "beginner", icon: "🦀" },
];

const levelColors = {
  beginner: "#93c5fd",
  intermediate: "#86efac",
  expert: "#fde047",
};
</script>

<template>
  <VueSelect
    v-model="selected"
    :is-multi="true"
    :options="skillOptions"
    placeholder="Select your skills"
  >
    <template #tag-content="{ option }">
      <span :style="{ display: 'flex', alignItems: 'center', gap: '4px' }">
        <span>{{ option.icon }}</span>
        <strong>{{ option.label }}</strong>
        <span
          :style="{
            fontSize: '10px',
            padding: '2px 4px',
            borderRadius: '2px',
            backgroundColor: levelColors[option.level],
            color: '#000',
            fontWeight: 500,
          }"
        >
          {{ option.level }}
        </span>
      </span>
    </template>
  </VueSelect>
</template>
```

## Key Benefits

1. **Simpler Implementation**: No need to recreate the tag structure or remove button
2. **Consistent Styling**: Automatically inherits all CSS variables for tags
3. **Type Safety**: Full TypeScript support with option typing
4. **Less Code**: Focus only on the content formatting
5. **Maintainability**: Future component updates automatically apply

## Comparison: `#tag` vs `#tag-content`

### With `#tag-content` (Simpler)

```html
<template #tag-content="{ option }">
  <strong>{{ option.label }}</strong>
</template>
```

The component handles:
- Tag wrapper (`<div class="multi-value">`)
- Remove button with icon
- Click handlers
- Styling with CSS variables

### With `#tag` (Full Control)

```html
<template #tag="{ option, removeOption }">
  <div class="custom-tag">
    <strong>{{ option.label }}</strong>
    <button @click="removeOption">×</button>
  </div>
</template>
```

You must handle:
- Complete tag structure
- Custom button and event handler
- All styling from scratch
