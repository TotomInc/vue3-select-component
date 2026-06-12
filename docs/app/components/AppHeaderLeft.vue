<script setup lang="ts">
const appConfig = useAppConfig()
const site = useSiteConfig()
const { localePath } = useDocusI18n()

const ariaLabel = appConfig.header?.title || site.name
</script>

<template>
  <NuxtLink
    :to="localePath('/')"
    :aria-label="ariaLabel"
    class="flex min-w-0 items-center"
  >
    <AppHeaderLogo />
  </NuxtLink>
</template>
