<script setup lang="ts">
import type { SelectPopoverProps } from "@/types/primitives";

import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";
import { resolveHTMLElement } from "@/lib/dom";

const props = withDefaults(defineProps<SelectPopoverProps>(), {
  teleport: true,
});

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);

const isTeleportEnabled = computed(() => props.teleport !== false);

const teleportTarget = computed(() => {
  if (props.teleport === false) {
    return "body";
  }

  if (props.teleport === true) {
    return "body";
  }

  if (typeof props.teleport === "string") {
    return props.teleport;
  }

  if (props.teleport instanceof HTMLElement) {
    return props.teleport;
  }

  return "body";
});

function onPopoverElement(element: Parameters<typeof resolveHTMLElement>[0]) {
  context.registerPopoverElement(resolveHTMLElement(element));
}
</script>

<template>
  <Teleport
    :to="teleportTarget"
    :disabled="!isTeleportEnabled"
  >
    <div
      v-show="isOpen"
      :ref="onPopoverElement"
      data-select-popover
      :aria-hidden="!isOpen"
    >
      <slot />
    </div>
  </Teleport>
</template>
