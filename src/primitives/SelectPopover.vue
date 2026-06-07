<script setup lang="ts">
import type { SelectPopoverProps } from "@/types/primitives";

import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";
import { resolveHTMLElement } from "@/lib/dom";

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
      data-select-popover
      :aria-hidden="!isOpen"
    >
      <slot />
    </div>
  </Teleport>
  <div
    v-else
    v-show="isOpen"
    :ref="onPopoverElement"
    data-select-popover
    :aria-hidden="!isOpen"
  >
    <slot />
  </div>
</template>
