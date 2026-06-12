<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <section class="demo-section">
    <header class="demo-section__header">
      <h2>{{ title }}</h2>
      <p v-if="description">
        {{ description }}
      </p>
    </header>

    <div class="demo-section__content">
      <slot />
    </div>
  </section>
</template>
