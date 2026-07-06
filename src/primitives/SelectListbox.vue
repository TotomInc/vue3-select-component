<script setup lang="ts">
import type { SelectDefaultSlots } from "@/types/slots";

import { computed, ref, watch } from "vue";
import { injectSelectContext } from "@/lib/context";

defineSlots<SelectDefaultSlots>();

const context = injectSelectContext();
const listboxElement = ref<HTMLElement | null>(null);

const isMultiple = computed(() => context.multiple.value);
const labelledBy = computed(() => {
  if (context.searchable.value) {
    return context.inputElement.value?.id ?? context.inputId;
  }

  return context.triggerId;
});

function onListboxKeydown(event: KeyboardEvent) {
  context.handleKeydown(event);
}

// Scroll into view the active option when navigating with keyboard on listbox.
watch(
  () => [context.activeOptionElementId.value, context.isOpen.value] as const,
  ([activeId, isOpen]) => {
    if (activeId == null || !isOpen) {
      return;
    }

    const listbox = listboxElement.value;

    if (listbox == null) {
      return;
    }

    const activeElement = listbox.querySelector<HTMLElement>(`#${CSS.escape(activeId)}`);

    activeElement?.scrollIntoView({ block: "nearest" });
  },
  { flush: "post" },
);
</script>

<template>
  <div
    :id="context.listboxId"
    ref="listboxElement"
    role="listbox"
    data-select-listbox
    :aria-labelledby="labelledBy"
    :aria-multiselectable="isMultiple"
    tabindex="-1"
    @keydown="onListboxKeydown"
  >
    <slot />
  </div>
</template>
