<script setup lang="ts">
import { injectSelectContext } from "@v1/lib/context";
import { computed } from "vue";

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);
const isDisabled = computed(() => context.disabled.value);

function onTriggerClick() {
  context.toggle();
}
</script>

<template>
  <button
    type="button"
    data-v1-select-trigger
    :aria-expanded="isOpen"
    :disabled="isDisabled"
    @click="onTriggerClick"
  >
    <slot />
  </button>
</template>
