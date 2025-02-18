<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="placeholder">
    {{ text }}
  </div>
</template>

<style lang="css" scoped>
.placeholder {
  grid-area: 1 / 1 / 2 / 3;
  color: var(--vs-placeholder-color);
}
</style>
