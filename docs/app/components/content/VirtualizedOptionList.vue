<script setup lang="ts">
import { useVirtualList } from "@vueuse/core";
import { computed, watch } from "vue";
import {
  injectSelectContext,
  SelectNoOptions,
  SelectOption,
} from "vue3-select-component/primitives";

defineProps<{
  totalCount: number;
}>();

const OPTION_ROW_HEIGHT = 40;

const context = injectSelectContext();

const filteredOptions = computed(() => [...context.filteredOptions.value]);

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  filteredOptions,
  {
    itemHeight: OPTION_ROW_HEIGHT,
    overscan: 8,
  },
);

watch(
  () => context.activeOptionValue.value,
  (activeValue) => {
    if (activeValue == null) {
      return;
    }

    const activeIndex = filteredOptions.value.findIndex(
      (option) => option.value === activeValue,
    );

    if (activeIndex >= 0) {
      scrollTo(activeIndex);
    }
  },
);
</script>

<template>
  <SelectNoOptions />

  <div
    class="virtualized-option-list"
    v-bind="containerProps"
  >
    <div v-bind="wrapperProps">
      <SelectOption
        v-for="item in list"
        :key="String(item.data.value)"
        :value="item.data.value"
        :label="item.data.label"
        :disabled="item.data.disabled"
        class="virtualized-option-list__row"
      />
    </div>
  </div>

  <p class="virtualized-option-list__stats">
    {{ totalCount.toLocaleString() }} options registered.
    {{ list.length }} rows mounted in the DOM.
  </p>
</template>

<style scoped>
.virtualized-option-list {
  height: var(--vs-menu-height, 200px);
  overflow: auto;
}

.virtualized-option-list__row {
  height: 40px;
  box-sizing: border-box;
}

.virtualized-option-list__stats {
  margin: 0.75rem 0 0;
  padding: 0 0.75rem 0.75rem;
  font-size: 0.8125rem;
  color: #71717a;
}
</style>
