<script setup lang="ts">
type Props = {
  accent?: boolean;
};

withDefaults(defineProps<Props>(), {
  accent: false,
});
</script>

<template>
  <section
    :class="[
      'grid gap-4 rounded-2xl border border-[color:var(--playground-border)] p-5',
      accent ? 'bg-[var(--playground-panel-strong)]' : 'bg-[var(--playground-panel)]',
    ]"
  >
    <slot />
  </section>
</template>
