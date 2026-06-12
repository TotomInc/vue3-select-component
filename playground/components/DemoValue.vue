<script setup lang="ts">
defineProps<{
  label?: string;
  value: unknown;
}>();
</script>

<template>
  <output class="demo-value">
    <span class="demo-value__label">{{ label ?? "Value" }}</span>
    <code>{{ JSON.stringify(value) }}</code>
  </output>
</template>
