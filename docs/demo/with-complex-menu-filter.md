---
title: 'With complex menu filter'
---

# With complex menu filter

The following example demonstrate how you can create a complex filter inside the options menu, using:

- `displayedOptions` prop.
- `#menu-header` slot.

Make sure to check the props & slots documentation for each of them.

<script setup lang="ts">
import { computed, ref } from "vue";

import VueSelect from "../../src";

const itUsers = [
  { label: "Alice (IT)", value: "alice" },
  { label: "Bob (IT)", value: "bob" },
  { label: "Charlie (IT)", value: "charlie" },
  { label: "David (IT)", value: "david" },
];

const hrUsers = [
  { label: "Eva (HR)", value: "eva" },
  { label: "Frank (HR)", value: "frank" },
  { label: "Grace (HR)", value: "grace" },
  { label: "Helen (HR)", value: "helen" },
];

const filter = ref<"it" | "hr">("it");
const selectedUsers = ref<string[]>([]);

const options = computed(() => [...itUsers, ...hrUsers]);
const displayedOptions = computed(() => filter.value === "it" ? itUsers : hrUsers);

function switchFilter() {
  filter.value = filter.value === "it" ? "hr" : "it";
};
</script>

<VueSelect
  v-model="selectedUsers"
  :options="options"
  :displayed-options="displayedOptions"
  :is-multi="true"
  placeholder="Select users"
>
  <template #menu-header>
    <button type="button" @click="switchFilter" >
      Switch filter type (current: {{ filter }})
    </button>
  </template>
</VueSelect>

<style scoped>
:deep(.menu button) {
  padding: 4px 8px;
  color: black;
  text-decoration: underline;
}
</style>

## Demo source-code

```vue
<script setup lang="ts">
import "vue3-select-component/dist/style.css";

import { computed, ref } from "vue";
import VueSelect from "vue3-select-component";

const itUsers = [
  { label: "Alice (IT)", value: "alice" },
  { label: "Bob (IT)", value: "bob" },
  { label: "Charlie (IT)", value: "charlie" },
  { label: "David (IT)", value: "david" },
];

const hrUsers = [
  { label: "Eva (HR)", value: "eva" },
  { label: "Frank (HR)", value: "frank" },
  { label: "Grace (HR)", value: "grace" },
  { label: "Helen (HR)", value: "helen" },
];

const filter = ref<"it" | "hr">("it");
const selectedUsers = ref<string[]>([]);

const options = computed(() => [...itUsers, ...hrUsers]);
const displayedOptions = computed(() => filter.value === "it" ? itUsers : hrUsers);

function switchFilter() {
  filter.value = filter.value === "it" ? "hr" : "it";
};
</script>

<VueSelect
  v-model="selectedUsers"
  :options="options"
  :displayed-options="displayedOptions"
  :is-multi="true"
  placeholder="Select users"
>
  <template #menu-header>
    <button type="button" @click="switchFilter" >
      Switch filter type (current: {{ filter }})
    </button>
  </template>
</VueSelect>
```
