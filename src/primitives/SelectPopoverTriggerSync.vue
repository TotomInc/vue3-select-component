<script setup lang="ts">
import { injectPopoverRootContext } from "reka-ui";
import { watch } from "vue";
import { injectSelectContext } from "@/lib/context";

const context = injectSelectContext();
const popoverRootContext = injectPopoverRootContext();

watch(
  () => context.triggerElement.value,
  (element) => {
    popoverRootContext.triggerElement.value = element ?? undefined;
  },
  { immediate: true },
);
</script>

<template />
