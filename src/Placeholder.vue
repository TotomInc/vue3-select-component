<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="input-placeholder">
    {{ text }}
  </div>
</template>

<style lang="css" scoped>
.input-placeholder {
  grid-area: 1 / 1 / 2 / 3;
  color: var(--vs-placeholder-color);
}
</style>
