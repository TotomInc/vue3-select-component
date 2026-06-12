<script setup lang="ts">
import type { SelectIconSlots } from "@/types/slots";

defineSlots<SelectIconSlots>();
</script>

<template>
  <span
    data-select-icon
    aria-hidden="true"
  >
    <slot />
  </span>
</template>
