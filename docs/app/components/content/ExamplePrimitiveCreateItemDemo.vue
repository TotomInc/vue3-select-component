<script setup lang="ts">
import { ref } from "vue";
import {
  SelectCreateItem,
  SelectInput,
  SelectListbox,
  SelectNoOptions,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "vue3-select-component/primitives";

const statuses = ref(["Backlog", "Todo", "In Progress", "Done"]);
const selected = ref("Backlog");

function onCreate(item: string) {
  statuses.value.push(item);
  selected.value = item;
}
</script>

<template>
  <div data-assembled-select class="select-demo">
    <SelectRoot
      v-model="selected"
      searchable
      create-item
      @create="onCreate"
    >
      <SelectTrigger>
        <SelectValue placeholder="Pick or create a status" />
        <SelectInput />
        <SelectTrailingIcon />
      </SelectTrigger>

      <SelectPopover>
        <SelectListbox>
          <SelectNoOptions />
          <SelectOption
            v-for="status in statuses"
            :key="status"
            :value="status"
            :label="status"
          />
          <SelectCreateItem>
            <template #default="{ searchValue }">
              <span class="select-primitive-create">
                Add "{{ searchValue }}"
              </span>
            </template>
          </SelectCreateItem>
        </SelectListbox>
      </SelectPopover>
    </SelectRoot>

    <output class="select-demo__value">
      <span class="select-demo__value-label">Value</span>
      <code>{{ JSON.stringify(selected) }}</code>
    </output>
  </div>
</template>
