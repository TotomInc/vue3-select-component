<script setup lang="ts">
import type { PopoverContentEmits } from "reka-ui";
import type { SelectPopoverProps } from "@/types/primitives";

import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  useForwardPropsEmits,
} from "reka-ui";
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";
import { resolveHTMLElement } from "@/lib/dom";
import SelectPopoverTriggerSync from "./SelectPopoverTriggerSync.vue";

const props = withDefaults(defineProps<SelectPopoverProps>(), {
  teleport: true,
  side: "bottom",
  align: "start",
  sideOffset: 4,
  avoidCollisions: true,
});

const emits = defineEmits<PopoverContentEmits>();

const context = injectSelectContext();

const isOpen = computed(() => context.isOpen.value);

const triggerReference = computed(() => context.triggerElement.value ?? undefined);

const isTeleportEnabled = computed(() => props.teleport !== false);

const teleportTarget = computed(() => {
  if (props.teleport === false) {
    return undefined;
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

const contentProps = computed(() => {
  const { teleport: _teleport, ...rest } = props;

  return rest;
});

const forwarded = useForwardPropsEmits(contentProps, emits);

function onOpenChange(open: boolean) {
  if (open) {
    context.open();
    return;
  }

  context.close();
}

function onPopoverElement(element: Parameters<typeof resolveHTMLElement>[0]) {
  context.registerPopoverElement(resolveHTMLElement(element));
}
</script>

<template>
  <PopoverRoot
    :open="isOpen"
    @update:open="onOpenChange"
  >
    <SelectPopoverTriggerSync />
    <PopoverAnchor :reference="triggerReference" />
    <PopoverPortal
      :to="teleportTarget"
      :disabled="!isTeleportEnabled"
      force-mount
    >
      <PopoverContent
        v-bind="{ ...forwarded, ...$attrs }"
        force-mount
        as-child
        @open-auto-focus.prevent
      >
        <div
          :ref="onPopoverElement"
          data-select-popover
          :aria-hidden="!isOpen"
          :hidden="!isOpen"
        >
          <slot />
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
