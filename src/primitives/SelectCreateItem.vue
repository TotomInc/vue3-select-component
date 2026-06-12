<script setup lang="ts">
import { computed } from "vue";
import { injectSelectContext } from "@/lib/context";

const context = injectSelectContext();

const isVisible = computed(() => context.showCreateItem.value);
const isActive = computed(() => context.isCreateItemActive.value);
const searchValue = computed(() => context.createItemSearchValue.value);
const createItemElementId = computed(() => context.createItemElementId);

function onCreateItemClick() {
  context.selectCreateItem();
}
</script>

<template>
  <div
    v-if="isVisible"
    :id="createItemElementId"
    role="option"
    data-select-create-item
    :data-active="isActive"
    aria-selected="false"
    @click="onCreateItemClick"
  >
    <slot :search-value="searchValue">
      Create "{{ searchValue }}"
    </slot>
  </div>
</template>
