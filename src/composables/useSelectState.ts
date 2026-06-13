import type { Ref } from "vue";
import type { SelectContext } from "../lib/context";
import type { CreateItemMode } from "../lib/create-item";
import type { FilterByFn } from "../lib/filter";
import type { SelectModelValue } from "../types/model";
import type { SelectOption } from "../types/option";
import type { useSelectCollection } from "./useSelectCollection";

import { computed, ref, shallowRef, watch } from "vue";
import { getEnabledOptions } from "@/composables/useSelectCollection";
import { shouldShowCreateItem } from "@/lib/create-item";
import { defaultSelectFilterBy, filterOptions } from "@/lib/filter";
import { createSelectInstanceId } from "@/lib/ids";

import { useSelectDismiss } from "./useSelectDismiss";
import { useSelectKeyboard } from "./useSelectKeyboard";

type SelectStateEvents<OptionValue> = {
  onMenuOpened?: () => void;
  onMenuClosed?: () => void;
  onSearch?: (value: string) => void;
  onCreate?: (value: string) => void;
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
  resetSearchOnBlur?: Ref<boolean>;
  resetSearchOnSelect?: Ref<boolean>;
  hideSelected?: Ref<boolean>;
  createItem?: Ref<CreateItemMode | undefined>;
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
  const inputId = `${instanceId}-input`;
  const listboxId = `${instanceId}-listbox`;
  const createItemElementId = `${instanceId}-create-item`;

  const isOpen = ref(false);
  const searchValue = ref("");
  const activeOptionValue = shallowRef<OptionValue | null>(null);
  const isCreateItemActive = ref(false);
  const inputElement = ref<HTMLInputElement | null>(null);

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

  const showCreateItem = computed(() =>
    shouldShowCreateItem(
      params.createItem?.value,
      params.searchable.value,
      searchValue.value,
      filteredOptions.value.length,
    ),
  );

  const createItemSearchValue = computed(() => searchValue.value.trim());

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
    if (isCreateItemActive.value) {
      return createItemElementId;
    }

    if (activeOptionValue.value == null) {
      return undefined;
    }

    const activeOption = params.collection.allOptions.value.find(
      (option) => option.value === activeOptionValue.value,
    );

    return activeOption?.id;
  });

  const syncActiveOptionWithFilter = () => {
    const isTyping = params.searchable.value && searchValue.value.length > 0;

    if (isTyping) {
      focusFirstOption();
      return;
    }

    if (isCreateItemActive.value && showCreateItem.value) {
      return;
    }

    isCreateItemActive.value = false;

    const isActiveInFiltered = activeOptionValue.value != null
      && navigableOptions.value.some((option) => option.value === activeOptionValue.value);

    if (isActiveInFiltered) {
      return;
    }

    activeOptionValue.value = navigableOptions.value[0]?.value ?? null;

    if (activeOptionValue.value == null && showCreateItem.value) {
      isCreateItemActive.value = true;
    }
  };

  const setActiveOptionValue = (value: OptionValue | null) => {
    activeOptionValue.value = value;
  };

  const focusFirstOption = () => {
    activeOptionValue.value = navigableOptions.value[0]?.value ?? null;
    isCreateItemActive.value = activeOptionValue.value == null && showCreateItem.value;
  };

  const focusSearchInput = () => {
    if (!params.searchable.value) {
      return;
    }

    inputElement.value?.focus();
  };

  const moveActiveOption = (direction: 1 | -1) => {
    const options = navigableOptions.value;
    const hasCreateItem = showCreateItem.value;
    const totalItems = options.length + (hasCreateItem ? 1 : 0);

    if (totalItems === 0) {
      activeOptionValue.value = null;
      isCreateItemActive.value = false;
      return;
    }

    const currentIndex = isCreateItemActive.value
      ? options.length
      : (activeOptionValue.value == null
          ? -1
          : options.findIndex((option) => option.value === activeOptionValue.value));

    const nextIndex = currentIndex === -1
      ? (direction === 1 ? 0 : totalItems - 1)
      : (currentIndex + direction + totalItems) % totalItems;

    if (hasCreateItem && nextIndex === options.length) {
      isCreateItemActive.value = true;
      activeOptionValue.value = null;
      return;
    }

    isCreateItemActive.value = false;
    activeOptionValue.value = options[nextIndex]?.value ?? null;
  };

  const open = () => {
    if (params.disabled.value) {
      return;
    }

    const wasOpen = isOpen.value;
    isOpen.value = true;
    focusFirstOption();
    focusSearchInput();

    if (!wasOpen) {
      params.events?.onMenuOpened?.();
    }
  };

  const clearSearch = () => {
    searchValue.value = "";
  };

  const close = () => {
    const wasOpen = isOpen.value;
    isOpen.value = false;

    if (params.resetSearchOnBlur?.value ?? true) {
      clearSearch();
    }

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

      if (params.resetSearchOnSelect?.value ?? true) {
        clearSearch();
      }

      if (shouldCloseOnSelect()) {
        close();
      }

      return;
    }

    params.modelValue.value = value;
    params.events?.onOptionSelected?.(value);

    if (params.resetSearchOnSelect?.value ?? true) {
      clearSearch();
    }

    if (shouldCloseOnSelect()) {
      close();
    }
  };

  const selectCreateItem = () => {
    if (!showCreateItem.value || params.disabled.value) {
      return;
    }

    const value = createItemSearchValue.value;

    if (!value) {
      return;
    }

    params.events?.onCreate?.(value);

    if (params.resetSearchOnSelect?.value ?? true) {
      clearSearch();
    }

    isCreateItemActive.value = false;

    if (shouldCloseOnSelect()) {
      close();
    }
  };

  const selectActiveOption = () => {
    if (isCreateItemActive.value) {
      selectCreateItem();
      return;
    }

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

  const registerInputElement = (element: HTMLInputElement | null) => {
    inputElement.value = element;
  };

  const {
    registerRootElement,
    registerTriggerElement,
    registerPopoverElement,
    rootElement,
    triggerElement,
    popoverElement,
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
    inputId,
    listboxId,
    activeOptionElementId,
    allOptions: params.collection.allOptions,
    filteredOptions,
    selectedOptions,
    showCreateItem,
    createItemSearchValue,
    isCreateItemActive: computed(() => isCreateItemActive.value),
    createItemElementId,
    open,
    close,
    toggle,
    select,
    selectCreateItem,
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
    registerInputElement,
    registerPopoverElement,
    rootElement,
    triggerElement,
    inputElement,
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
    () => [isOpen.value, navigableOptions.value, showCreateItem.value] as const,
    ([open, navigable, canCreate]) => {
      if (!open || (navigable.length === 0 && !canCreate)) {
        return;
      }

      syncActiveOptionWithFilter();
    },
    { flush: "sync" },
  );

  return { context };
}
