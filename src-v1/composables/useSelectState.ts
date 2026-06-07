import type { Ref } from "vue";
import type { SelectContext } from "../lib/context";
import type { FilterByFn } from "../lib/filter";
import type { SelectModelValue } from "../types/model";
import type { SelectOption } from "../types/option";
import type { useSelectCollection } from "./useSelectCollection";

import { findNextEnabledOption, getEnabledOptions } from "@v1/composables/useSelectCollection";
import { defaultSelectFilterBy, filterOptions } from "@v1/lib/filter";
import { computed, ref, shallowRef, watch } from "vue";

import { useSelectKeyboard } from "./useSelectKeyboard";

type UseSelectStateParams<OptionValue extends string | number> = {
  modelValue: Ref<SelectModelValue<OptionValue>>;
  multiple: Ref<boolean>;
  disabled: Ref<boolean>;
  searchable: Ref<boolean>;
  clearable: Ref<boolean>;
  loading: Ref<boolean>;
  propOptions: Ref<readonly SelectOption<OptionValue>[]>;
  filterBy: Ref<FilterByFn<OptionValue>>;
  collection: ReturnType<typeof useSelectCollection<OptionValue>>;
};

function normalizeSelectedValues<OptionValue>(
  modelValue: SelectModelValue<OptionValue>,
  multiple: boolean,
): OptionValue[] {
  if (multiple) {
    return Array.isArray(modelValue) ? modelValue : [];
  }

  if (modelValue == null) {
    return [];
  }

  return [modelValue as OptionValue];
}

export function useSelectState<OptionValue extends string | number>(params: UseSelectStateParams<OptionValue>) {
  const isOpen = ref(false);
  const searchValue = ref("");
  const activeOptionValue = shallowRef<OptionValue | null>(null);

  const filteredOptions = computed(() => {
    const searchable = params.searchable.value;
    const search = searchable ? searchValue.value : "";
    const filterBy = params.filterBy.value ?? defaultSelectFilterBy;

    return filterOptions(params.collection.allOptions.value, search, filterBy);
  });

  const navigableOptions = computed(() => getEnabledOptions(filteredOptions.value));

  const selectedOptions = computed(() => {
    const selectedValues = normalizeSelectedValues(params.modelValue.value, params.multiple.value);
    const optionsByValue = new Map(
      params.collection.allOptions.value.map((option) => [option.value, option]),
    );

    return selectedValues
      .map((value) => optionsByValue.get(value))
      .filter((option): option is NonNullable<typeof option> => option != null);
  });

  const syncActiveOptionWithFilter = () => {
    const isActiveInFiltered = activeOptionValue.value != null
      && navigableOptions.value.some((option) => option.value === activeOptionValue.value);

    if (isActiveInFiltered) {
      return;
    }

    activeOptionValue.value = navigableOptions.value[0]?.value ?? null;
  };

  const setActiveOptionValue = (value: OptionValue | null) => {
    activeOptionValue.value = value;
  };

  const focusFirstOption = () => {
    activeOptionValue.value = navigableOptions.value[0]?.value ?? null;
  };

  const moveActiveOption = (direction: 1 | -1) => {
    const nextOption = findNextEnabledOption(
      filteredOptions.value,
      activeOptionValue.value,
      direction,
    );

    activeOptionValue.value = nextOption?.value ?? null;
  };

  const open = () => {
    if (params.disabled.value) {
      return;
    }

    isOpen.value = true;
    focusFirstOption();
  };

  const close = () => {
    isOpen.value = false;
    searchValue.value = "";
    activeOptionValue.value = null;
  };

  const toggle = () => {
    if (isOpen.value) {
      close();
      return;
    }

    open();
  };

  const select = (value: OptionValue) => {
    if (params.disabled.value) {
      return;
    }

    const option = params.collection.allOptions.value.find((item) => item.value === value);

    if (option?.disabled) {
      return;
    }

    if (params.multiple.value) {
      const current = Array.isArray(params.modelValue.value) ? params.modelValue.value : [];
      const isAlreadySelected = current.includes(value);

      params.modelValue.value = isAlreadySelected
        ? current.filter((item) => item !== value)
        : [...current, value];

      return;
    }

    params.modelValue.value = value;
    close();
  };

  const selectActiveOption = () => {
    if (activeOptionValue.value == null) {
      return;
    }

    select(activeOptionValue.value);
  };

  const deselect = (value: OptionValue) => {
    if (!params.multiple.value) {
      return;
    }

    const current = Array.isArray(params.modelValue.value) ? params.modelValue.value : [];

    params.modelValue.value = current.filter((item) => item !== value);
  };

  const deselectLast = () => {
    if (!params.multiple.value) {
      return;
    }

    const current = Array.isArray(params.modelValue.value) ? params.modelValue.value : [];
    const lastValue = current[current.length - 1];

    if (lastValue == null) {
      return;
    }

    params.modelValue.value = current.slice(0, -1);
  };

  const clear = () => {
    if (!params.clearable.value || params.disabled.value) {
      return;
    }

    params.modelValue.value = params.multiple.value ? [] : null;
  };

  const isOptionVisible = (value: OptionValue) =>
    filteredOptions.value.some((option) => option.value === value);

  const context: SelectContext<OptionValue> = {
    modelValue: params.modelValue,
    isOpen,
    searchValue,
    multiple: params.multiple,
    disabled: params.disabled,
    searchable: params.searchable,
    clearable: params.clearable,
    loading: params.loading,
    activeOptionValue: activeOptionValue as Ref<OptionValue | null>,
    allOptions: params.collection.allOptions,
    filteredOptions,
    selectedOptions,
    open,
    close,
    toggle,
    select,
    selectActiveOption,
    deselect,
    deselectLast,
    clear,
    registerOption: params.collection.register,
    unregisterOption: params.collection.unregister,
    setActiveOptionValue,
    moveActiveOption,
    focusFirstOption,
    isOptionVisible,
    handleKeydown: () => {},
  };

  const { handleKeydown } = useSelectKeyboard({ context });

  context.handleKeydown = handleKeydown;

  watch(searchValue, syncActiveOptionWithFilter, { flush: "sync" });

  watch(
    () => [isOpen.value, navigableOptions.value] as const,
    ([open, navigable]) => {
      if (!open || navigable.length === 0) {
        return;
      }

      syncActiveOptionWithFilter();
    },
    { flush: "sync" },
  );

  return { context };
}
