---
title: 'Events'
---

# Events

If you have the need for custom events, please open an issue on the [GitHub repository](https://github.com/TotomInc/vue3-select-component) with your use case and we will be happy to investigate it.

## `@option-selected`

Emitted when an option is selected, in the same tick where the `v-model` is updated.

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
If you want to keep track of the selected option, it is recommended to use a `computed` combined with the `v-model`, instead of this event ([see this issue comment](https://github.com/TotomInc/vue3-select-component/issues/7#issuecomment-2083422621)).

```ts
const options = [{ label: "France", value: "FR" }, { label: "Spain", value: "ES" }];
const activeValue = ref<string>();
const selectedOption = computed(() => options.find((option) => option.value === activeValue.value));
```
:::

## `@option-deselected`

Emitted when an option is deselected, in the same tick where the `v-model` is updated.

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
