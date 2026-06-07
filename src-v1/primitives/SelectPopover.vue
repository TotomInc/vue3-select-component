<script setup lang="ts">
import type { SelectPopoverProps } from "@v1/types/primitives";

import { injectSelectContext } from "@v1/lib/context";
import { resolveHTMLElement } from "@v1/lib/dom";
import { computed } from "vue";

const props = withDefaults(defineProps<SelectPopoverProps>(), {
  teleport: false,
});

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);

const teleportTarget = computed(() => {
  if (props.teleport === true) {
    return "body";
  }

  if (typeof props.teleport === "string") {
    return props.teleport;
  }

  return null;
});

function onPopoverElement(element: Parameters<typeof resolveHTMLElement>[0]) {
  context.registerPopoverElement(resolveHTMLElement(element));
}
</script>

<template>
  <Teleport
    v-if="teleportTarget"
    :to="teleportTarget"
  >
    <div
      v-show="isOpen"
      :ref="onPopoverElement"
      data-v1-select-popover
      :aria-hidden="!isOpen"
    >
      <slot />
    </div>
  </Teleport>
  <div
    v-else
    v-show="isOpen"
    :ref="onPopoverElement"
    data-v1-select-popover
    :aria-hidden="!isOpen"
  >
    <slot />
  </div>
</template>
