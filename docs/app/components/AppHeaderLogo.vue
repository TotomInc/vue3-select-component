<script setup lang="ts">
const appConfig = useAppConfig();
const { public: { packageVersion } } = useRuntimeConfig();
const { hasLogo, headerLightUrl, headerDarkUrl, contextMenuItems } = useLogoAssets();

const title = computed(() => appConfig.header?.title ?? "Vue3-Select-Component");
</script>

<template>
  <div class="flex min-w-0 items-center gap-2">
    <UContextMenu
      v-if="hasLogo"
      :items="contextMenuItems"
    >
      <UColorModeImage
        :light="headerLightUrl"
        :dark="headerDarkUrl"
        :alt="appConfig.header?.logo?.alt || title"
        class="h-6 w-auto shrink-0"
        :class="[appConfig.header?.logo?.class]"
      />
    </UContextMenu>

    <span class="truncate text-sm font-semibold text-highlighted">
      {{ title }}
    </span>

    <UBadge
      v-if="packageVersion"
      color="neutral"
      variant="subtle"
      size="sm"
      class="shrink-0 hidden sm:inline-flex"
    >
      v{{ packageVersion }}
    </UBadge>
  </div>
</template>
