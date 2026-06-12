<script setup lang="ts">
import type { SelectDefaultSlots } from "@/types/slots";

import { onMounted, onUnmounted } from "vue";
import { injectSelectGroupContext } from "@/lib/group-context";

defineSlots<SelectDefaultSlots>();

const groupContext = injectSelectGroupContext();
const labelId = groupContext.labelId;
const isVisible = groupContext.isVisible;

onMounted(() => {
  groupContext.registerLabel();
});

onUnmounted(() => {
  groupContext.unregisterLabel();
});
</script>

<template>
  <div
    v-show="isVisible"
    :id="labelId"
    data-select-group-label
  >
    <slot />
  </div>
</template>
