---
title: 'Slots'
---

# Slots

To ensure maximum flexibility, this component provides multiple `<slot />`s in order to allow for more customization.

::: info
If you are not familiar with Vue's slots, you can read more about them [here](https://vuejs.org/guide/components/slots.html).
:::

## option

**Type**:

```ts
slotProps: {
  option: Option;
  index: number;
  isFocused: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}
```

Customize the rendered template of an option inside the menu. You can use the slot props to retrieve the current menu option that will be rendered in order to have more context and flexbility.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #option="{ option, index }">
      {{ option.label }} - {{ option.value }} (#{{ index }})
    </template>
  </VueSelect>
</template>
```

## value

**Type**: `slotProps: { option: Option }`

Customize the rendered template if a selected option (inside the select control). You can use the slot props to retrieve the current selected option.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #value="{ option }">
      My value is: {{ option.value }}
    </template>
  </VueSelect>
</template>
```

## tag

**Type**: `slotProps: { option: Option, removeOption: () => void }`

When using `isMulti` prop, customize the rendered template of a selected option. You can use the slot props to retrieve the current selected option and a function to remove it.

```vue
<template>
  <VueSelect
    v-model="option"
    :options="options"
    :is-multi="true"
  >
    <template #tag="{ option, removeOption }">
      <span>{{ option.label }} <button type="button" @click="removeOption">&times;</button></span>
    </template>
  </VueSelect>
</template>
```

## menu-header

**Type**: `slotProps: {}`

Customize the rendered template for the menu header. This slot is placed **before** the options.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #menu-header>
      <div>
        <h3>My custom header</h3>
      </div>
    </template>
  </VueSelect>
</template>
```

## no-options

**Type**: `slotProps: {}`

Customize the rendered template when there are no options matching the search, inside the menu.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #no-options>
      No options found.
    </template>
  </VueSelect>
</template>
```

## dropdown

**Type**: `slotProps: {}`

Customize the rendered template for the dropdown icon. Please note that the slot is placed **inside the button**, so you don't have to deal with attaching event-listeners.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #dropdown>
      <MyCustomIcon />
    </template>
  </VueSelect>
</template>
```

## clear

**Type**: `slotProps: {}`

Customize the rendered template for the clear icon. Please note that the slot is placed **inside the button**, so you don't have to deal with attaching event-listeners.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #clear>
      <MyCustomIcon />
    </template>
  </VueSelect>
</template>
```

## loading

**Type**: `slotProps: {}`

Customize the rendered template when the select component is in a loading state. By default, it displays a `<Spinner />` component.

```vue
<template>
  <VueSelect
    v-model="option"
    :options="options"
    :is-loading="true"
  >
    <template #loading>
      <MyCustomLoadingComponent />
    </template>
  </VueSelect>
</template>
```

## taggable-no-options

**Type**: `slotProps: { option: string }`

Customize the rendered template when there are no matching options and the `taggable` prop is set to `true`. You can use the slot props to retrieve the current search value.

```vue
<template>
  <VueSelect
    v-model="option"
    :options="options"
    :taggable="true"
  >
    <template #taggable-no-options="{ option }">
      Press enter to add {{ option }} option
    </template>
  </VueSelect>
</template>
```

## placeholder

**Type**: `slotProps: { text: string }`

Customize the rendered template for the placeholder.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #placeholder>
      <span>Custom placeholder</span>
    </template>
  </VueSelect>
</template>
```
