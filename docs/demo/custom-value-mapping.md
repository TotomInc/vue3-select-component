---
title: 'Custom value mapping'
---

# Custom value mapping

::: warning
This isn't a common use-case. You should use the `label` and `value` properties of the option object when possible.
Doing this will break the type-safety of the component.
Read more about [`getOptionLabel` and `getOptionValue` props](../props.md).
:::

In the rare case you need to use different properties for the `label` and `value` of an option, you can use the `getOptionLabel` and `getOptionValue` props.

If you're using TypeScript, be sure to read the [type-safety guide for these props](../typescript.md#custom-value-mapping) section.

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";


const selected = ref("");
</script>

<ClientOnly>
  <VueSelect
    v-model="selected"
    :get-option-label="option => option.id"
    :get-option-value="option => option.key"
    :options="[
      { id: 'France', key: 'fr' },
      { id: 'USA', key: 'us' },
      { id: 'Germany', key: 'de' },
    ]"
  />
</ClientOnly>

## Demo source-code

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";

const selected = ref("");
</script>

<template>
  <VueSelect
    v-model="selected"
    :get-option-label="option => option.id"
    :get-option-value="option => option.key"
    :options="[
      { key: 'fr', id: 'France' },
      { key: 'us', id: 'USA' },
      { key: 'de', id: 'Germany' },
    ]"
  />
</template>
```
