---
title: 'Custom tag slot'
---

# Custom tag slot

The following example demonstrates how to use the `VueSelect` component with a custom slot `#tag` when using the `isMulti` prop.

::: info
Read more about available [slots here](../slots.md) and the `isMulti` prop [here](../props.md#isMulti).
:::

<script setup>
import { ref } from "vue";

import VueSelect from "../../src";

const selected = ref([]);
</script>

<ClientOnly>
  <VueSelect
    v-model="selected"
    :is-multi="true"
    :options="[
      { label: 'Alice', value: 'alice', username: '@alice_user' },
      { label: 'John', value: 'john', username: '@john_user' },
      { label: 'Greg', value: 'greg', username: '@greg_user' },
    ]"
  >
    <template #tag="{ option, removeOption }">
      <div :class="$style['custom-tag']">
        {{ option.username }} <button type="button" @click="removeOption">&times;</button>
      </div>
    </template>
  </VueSelect>
</ClientOnly>

<style module>
.custom-tag {
  --vs-multi-value-gap: 4px;

  display: flex;
  align-items: center;
  gap: var(--vs-multi-value-gap);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: var(--vs-multi-value-padding);
  margin: var(--vs-multi-value-margin);
  color: var(--vs-multi-value-text-color);
  line-height: var(--vs-multi-value-line-height);
  background: var(--vs-multi-value-bg);
}

.custom-tag button {
  font-size: 1.25rem;
  background: none;
}
</style>

## Demo source-code

```vue
<script setup>
import { ref } from "vue";
import VueSelect from "vue3-select-component";

const selected = ref([]);
</script>

<VueSelect
  v-model="selected"
  :is-multi="true"
  :options="[
    { label: 'Alice', value: 'alice', username: '@alice_user' },
    { label: 'John', value: 'john', username: '@john_user' },
    { label: 'Greg', value: 'greg', username: '@greg_user' },
  ]"
>
  <template #tag="{ option, removeOption }">
    <div class="custom-tag">
      {{ option.username }} <button type="button" @click="removeOption">&times;</button>
    </div>
  </template>
</VueSelect>

<style lang="css" scoped>
.custom-tag {
  --vs-multi-value-gap: 4px;

  display: flex;
  align-items: center;
  gap: var(--vs-multi-value-gap);
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: var(--vs-multi-value-padding);
  margin: var(--vs-multi-value-margin);
  color: var(--vs-multi-value-text-color);
  line-height: var(--vs-multi-value-line-height);
  background: var(--vs-multi-value-bg);
}

.custom-tag button {
  font-size: 1.25rem;
  background: none;
}
</style>
```
