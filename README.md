# Vue3-Select-Component

A select component for Vue 3 which helps you to develop a _simple yet powerful_ select control with ease that works out-of-the-box, while still allowing you to customize it to your needs.

**Documentation & demos with code**: https://vue3-select-component.vercel.app

This component includes the following features:

- Easy data manipulation with `v-model`
- Great styling out-of-the-box, customization with CSS variables & Vue `:deep`
- Single & multi-select
- Deep customization with `<slot>`s
- Teleport/portal menu

## Installation

Install the package with npm:

```bash
npm i vue3-select-component
```

Use it in your Vue 3 app:

```vue
<script setup lang="ts">
import { ref } from "vue";
import VueSelect from "vue3-select-component";

import "vue3-select-component/dist/style.css";

const option = ref("");
</script>

<template>
  <div class="my-app">
    <VueSelect
      v-model="option"
      :options="[
        { label: 'A Wizard of Earthsea', value: 'wizard_earthsea' },
        { label: 'Harry Potter and the Philosopher\'s Stone', value: 'harry_potter' },
        { label: 'The Lord of the Rings', value: 'the_lord_of_the_rings' },
      ]"
    />
  </div>
</template>
```

## License

MIT Licensed. Copyright (c) Thomas Cazade 2024.
