import type { Ref } from "vue";
import type { SelectContext } from "../lib/context";
import type { FilterByFn } from "../lib/filter";
import type { SelectModelValue } from "../types/model";
import type { SelectOption } from "../types/option";
import type { useSelectCollection } from "./useSelectCollection";

import { computed, ref, shallowRef, watch } from "vue";
import { findNextEnabledOption, getEnabledOptions } from "@/composables/useSelectCollection";
import { defaultSelectFilterBy, filterOptions } from "@/lib/filter";
import { createSelectInstanceId } from "@/lib/ids";

import { useSelectDismiss } from "./useSelectDismiss";
import { useSelectKeyboard } from "./useSelectKeyboard";

type SelectStateEvents<OptionValue> = {
  onMenuOpened?: () => void;
  onMenuClosed?: () => void;
  onSearch?: (value: string) => void;
  onOptionSelected?: (value: OptionValue) => void;
  onOptionDeselected?: (value: OptionValue | null) => void;
};

type UseSelectStateParams<OptionValue extends string | number> = {
  modelValue: Ref<SelectModelValue<OptionValue>>;
  multiple: Ref<boolean>;
  disabled: Ref<boolean>;
  searchable: Ref<boolean>;
  clearable: Ref<boolean>;
  loading: Ref<boolean>;
  closeOnSelect?: Ref<boolean | null | undefined>;
  hideSelected?: Ref<boolean>;
  propOptions: Ref<readonly SelectOption<OptionValue>[]>;
  filterBy: Ref<FilterByFn<OptionValue>>;
  collection: ReturnType<typeof useSelectCollection<OptionValue>>;
  events?: SelectStateEvents<OptionValue>;
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
  const instanceId = createSelectInstanceId();
  const triggerId = `${instanceId}-trigger`;
  const listboxId = `${instanceId}-listbox`;

  const isOpen = ref(false);
  const searchValue = ref("");
  const activeOptionValue = shallowRef<OptionValue | null>(null);

  const filteredOptions = computed(() => {
    const searchable = params.searchable.value;
    const search = searchable ? searchValue.value : "";
    const filterBy = params.filterBy.value ?? defaultSelectFilterBy;

    let options = filterOptions(params.collection.allOptions.value, search, filterBy);

    if (params.hideSelected?.value && params.multiple.value) {
      const selectedValues = normalizeSelectedValues(params.modelValue.value, true);
      const selectedSet = new Set(selectedValues);

      options = options.filter((option) => !selectedSet.has(option.value));
    }

    return options;
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

  const activeOptionElementId = computed(() => {
    if (activeOptionValue.value == null) {
      return undefined;
    }

    const activeOption = params.collection.allOptions.value.find(
      (option) => option.value === activeOptionValue.value,
    );

    return activeOption?.id;
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

    const wasOpen = isOpen.value;
    isOpen.value = true;
    focusFirstOption();

    if (!wasOpen) {
      params.events?.onMenuOpened?.();
    }
  };

  const close = () => {
    const wasOpen = isOpen.value;
    isOpen.value = false;
    searchValue.value = "";
    activeOptionValue.value = null;

    if (wasOpen) {
      params.events?.onMenuClosed?.();
    }
  };

  const toggle = () => {
    if (isOpen.value) {
      close();
      return;
    }

    open();
  };

  const shouldCloseOnSelect = () => {
    const configured = params.closeOnSelect?.value;

    if (configured != null) {
      return configured;
    }

    return !params.multiple.value;
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

      if (isAlreadySelected) {
        params.modelValue.value = current.filter((item) => item !== value);
        params.events?.onOptionDeselected?.(value);
        return;
      }

      params.modelValue.value = [...current, value];
      params.events?.onOptionSelected?.(value);

      if (shouldCloseOnSelect()) {
        close();
      }

      return;
    }

    params.modelValue.value = value;
    params.events?.onOptionSelected?.(value);

    if (shouldCloseOnSelect()) {
      close();
    }
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
    params.events?.onOptionDeselected?.(value);
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

    if (params.multiple.value) {
      params.modelValue.value = [];
      params.events?.onOptionDeselected?.(null);
      return;
    }

    const previousValue = params.modelValue.value;
    params.modelValue.value = null;

    if (previousValue != null) {
      params.events?.onOptionDeselected?.(previousValue as OptionValue);
    }
  };

  const isOptionVisible = (value: OptionValue) =>
    filteredOptions.value.some((option) => option.value === value);

  const {
    registerRootElement,
    registerTriggerElement,
    registerPopoverElement,
    rootElement,
    triggerElement,
    popoverElement
  } = useSelectDismiss({
    isOpen,
    close,
  });

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
    triggerId,
    listboxId,
    activeOptionElementId,
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
    registerRootElement,
    registerTriggerElement,
    registerPopoverElement,
    rootElement,
    triggerElement,
    popoverElement,
  };

  const { handleKeydown } = useSelectKeyboard({ context });

  context.handleKeydown = handleKeydown;

  watch(searchValue, (newSearch, oldSearch) => {
    syncActiveOptionWithFilter();

    const shouldEmitSearch = params.searchable.value
      && newSearch !== oldSearch
      && (newSearch.length > 0 || oldSearch.length > 0);

    if (shouldEmitSearch) {
      params.events?.onSearch?.(newSearch);
    }
  }, { flush: "sync" });

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
