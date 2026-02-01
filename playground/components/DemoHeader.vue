<script setup lang="ts">
type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

defineProps<Props>();
</script>

<template>
  <header class="flex flex-col gap-2">
    <p
      v-if="eyebrow"
      class="text-xs uppercase tracking-[0.2em] text-[color:var(--playground-muted)]"
    >
      {{ eyebrow }}
    </p>
    <h1 class="text-3xl font-semibold text-[color:var(--playground-text-strong)]">
      {{ title }}
    </h1>
    <p
      v-if="description || $slots.description"
      class="max-w-3xl text-sm leading-6 text-[color:var(--playground-muted)]"
    >
      <slot name="description">{{ description }}</slot>
    </p>
  </header>
</template>
