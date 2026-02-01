<script setup lang="ts">
type Props = {
  title?: string;
  description?: string;
};

defineProps<Props>();
</script>

<template>
  <div class="grid gap-3">
    <div v-if="title || description || $slots.header" class="grid gap-1">
      <slot name="header">
        <h2 v-if="title" class="text-lg font-semibold text-[color:var(--playground-text-strong)]">
          {{ title }}
        </h2>
        <p v-if="description" class="text-sm text-[color:var(--playground-muted)]">
          {{ description }}
        </p>
      </slot>
    </div>
    <slot />
  </div>
</template>
