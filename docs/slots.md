---
title: 'Slots'
---

# Slots

To ensure maximum flexibility, this component provides multiple `<slot />`s in order to allow for more customization.

::: info
If you are not familiar with Vue's slots, you can read more about them [here](https://vuejs.org/guide/components/slots.html).
:::

## option

**Type**: `slotProps: { option: Option }`

Customize the rendered HTML of an option inside the menu. You can use the slot props to retrieve the current menu option that will be rendered.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #option="{ option }">
      {{ option.label }} - {{ option.value }}
    </template>
  </VueSelect>
</template>
```

## value

**Type**: `slotProps: { option: Option }`

Customize the rendered HTML if a selected option (inside the select control). You can use the slot props to retrieve the current selected option.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #value="{ option }">
      My value is: {{ option.value }}
    </template>
  </VueSelect>
</template>
```

## menu-header

**Type**: `slotProps: {}`

Customize the rendered HTML for the menu header. This slot is placed **before** the options.

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

Customize the rendered HTML when there are no options matching the search, inside the menu.

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

Customize the rendered HTML for the dropdown icon. Please note that the slot is placed **inside the button**, so you don't have to deal with attaching event-listeners.

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

Customize the rendered HTML for the clear icon. Please note that the slot is placed **inside the button**, so you don't have to deal with attaching event-listeners.

```vue
<template>
  <VueSelect v-model="option" :options="options">
    <template #clear>
      <MyCustomIcon />
    </template>
  </VueSelect>
</template>
```
