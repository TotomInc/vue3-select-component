<script setup lang="ts">
type Props = {
  label: string;
};

defineProps<Props>();
</script>

<template>
  <p class="text-sm text-[color:var(--playground-muted)]">
    {{ label }}: <span class="font-semibold text-[color:var(--playground-text)]"><slot /></span>
  </p>
</template>
