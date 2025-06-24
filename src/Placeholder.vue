<script setup lang="ts" generic="GenericOption extends Option<OptionValue>, OptionValue = string">
import type { Option } from "./types/option";
import type { Slots } from "./types/slots";

defineProps<{
  text: string;
  placeholderSlot?: Slots<GenericOption, OptionValue>["placeholder"];
}>();
</script>

<template>
  <div class="input-placeholder">
    <component :is="placeholderSlot" v-if="placeholderSlot" />

    <template v-else>
      {{ text }}
    </template>
  </div>
</template>

<style lang="css" scoped>
.input-placeholder {
  grid-area: 1 / 1 / 2 / 3;
  color: var(--vs-placeholder-color);
}
</style>
