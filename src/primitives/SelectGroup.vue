<script setup lang="ts" generic="OptionValue extends string | number = string">
import type { SelectDefaultSlots } from "@/types/slots";

import { computed, ref, shallowRef } from "vue";
import { injectSelectContext } from "@/lib/context";
import { provideSelectGroupContext } from "@/lib/group-context";
import { createGroupId, createGroupLabelId } from "@/lib/ids";

defineSlots<SelectDefaultSlots>();

const context = injectSelectContext<OptionValue>();
const groupId = createGroupId();
const labelId = createGroupLabelId();
const hasLabel = ref(false);
const optionValues = shallowRef(new Set<OptionValue>());

const labelledBy = computed(() => hasLabel.value ? labelId : undefined);
const isVisible = computed(() => {
  if (optionValues.value.size === 0) {
    return true;
  }

  return [...optionValues.value].some((value) => context.isOptionVisible(value));
});

function registerLabel() {
  hasLabel.value = true;
}

function unregisterLabel() {
  hasLabel.value = false;
}

function registerOptionValue(value: OptionValue) {
  const nextValues = new Set(optionValues.value);
  nextValues.add(value);
  optionValues.value = nextValues;
}

function unregisterOptionValue(value: OptionValue) {
  const nextValues = new Set(optionValues.value);
  nextValues.delete(value);
  optionValues.value = nextValues;
}

provideSelectGroupContext<OptionValue>({
  groupId,
  labelId,
  labelledBy,
  isVisible,
  hasLabel,
  registerLabel,
  unregisterLabel,
  registerOptionValue,
  unregisterOptionValue,
});
</script>

<template>
  <div
    v-show="isVisible"
    :id="groupId"
    role="group"
    data-select-group
    :aria-labelledby="labelledBy"
  >
    <slot />
  </div>
</template>
