<script setup lang="ts">
import type { SelectPopoverProps } from "@v1/types/primitives";

import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

withDefaults(defineProps<SelectPopoverProps>(), {
  teleport: false,
});

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);
</script>

<template>
  <div
    v-if="isOpen"
    data-v1-select-popover
  >
    <slot />
  </div>
</template>
