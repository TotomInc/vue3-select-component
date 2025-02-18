---
title: 'Events'
---

# Events

## `@option-selected`

Emitted when an option is selected, in the same tick where the `v-model` is updated.

**Payload**: `Option` - The selected option.

```vue
<template>
  <VueSelect
    v-model="selectedValue"
    :options="options"
    @option-selected="(option) => console.log(option.label, option.value)"
  />
</template>
```

**Note**: this is emitted on the same tick as the v-model is updated, before a DOM re-render.

::: info
For keeping track of the selected option, it's recommended to use a `computed` property combined with the `v-model` instead of relying on the `@option-selected` event. This approach is more efficient and aligns better with Vue's reactivity system. Here's an example:

```ts
const options = [{ label: "France", value: "FR" }];
const activeValue = ref("FR");
const selectedOption = computed(
  () => options.find((option) => option.value === activeValue.value),
);
```
:::

## `@option-deselected`

Emitted when an option is deselected, in the same tick where the `v-model` is updated.

**Payload**: `Option` - The deselected option.

```vue
<template>
  <VueSelect
    v-model="selectedValue"
    :options="options"
    @option-deselected="(option) => console.log(option.label, option.value)"
  />
</template>
```

**Note**: this is emitted on the same tick as the v-model is updated, before a DOM re-render.

## `@option-created`

Emitted when a new option is created with the `:taggable="true"` prop.

**Payload**: `string` - The search content value.

```vue
<template>
  <VueSelect
    v-model="selectedValue"
    :options="options"
    :taggable="true"
    @option-created="(value) => console.log('New option created:', value)"
  />
</template>
```

## `@search`

Emitted when the search value is updated.

**Payload**: `string` - The search content value.

::: warning
Search value is cleared when the menu is closed. This will trigger an empty string emit event. See tests implementations for more details.
:::

```vue
<template>
  <VueSelect
    v-model="selectedValue"
    :options="options"
    @search="(search) => console.log('search value:', search)"
  />
</template>
```

## `@menu-opened`

Emitted when the menu is opened.

```vue
<template>
  <VueSelect
    v-model="selectedValue"
    :options="options"
    @menu-opened="() => console.log('menu opened')"
  />
</template>
```

## `@menu-closed`

Emitted when the menu is closed.

```vue
<template>
  <VueSelect
    v-model="selectedValue"
    :options="options"
    @menu-closed="() => console.log('menu closed')"
  />
</template>
```
