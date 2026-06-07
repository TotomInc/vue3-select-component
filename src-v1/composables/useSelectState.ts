import type { Ref } from "vue";
import type { SelectContext } from "../lib/context";
import type { SelectModelValue } from "../types/model";
import type { useSelectCollection } from "./useSelectCollection";

import { ref } from "vue";

type UseSelectStateParams<OptionValue> = {
  modelValue: Ref<SelectModelValue<OptionValue>>;
  multiple: Ref<boolean>;
  disabled: Ref<boolean>;
  searchable: Ref<boolean>;
  clearable: Ref<boolean>;
  loading: Ref<boolean>;
  collection: ReturnType<typeof useSelectCollection<OptionValue>>;
};

export function useSelectState<OptionValue>(params: UseSelectStateParams<OptionValue>) {
  const isOpen = ref(false);
  const searchValue = ref("");
  const activeOptionId = ref<string | null>(null);

  const open = () => {
    if (params.disabled.value) {
      return;
    }

    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    searchValue.value = "";
    activeOptionId.value = null;
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

  const deselect = (value: OptionValue) => {
    if (!params.multiple.value) {
      return;
    }

    const current = Array.isArray(params.modelValue.value) ? params.modelValue.value : [];

    params.modelValue.value = current.filter((item) => item !== value);
  };

  const clear = () => {
    if (!params.clearable.value || params.disabled.value) {
      return;
    }

    params.modelValue.value = params.multiple.value ? [] : null;
  };

  const context: SelectContext<OptionValue> = {
    modelValue: params.modelValue,
    isOpen,
    searchValue,
    multiple: params.multiple,
    disabled: params.disabled,
    searchable: params.searchable,
    clearable: params.clearable,
    loading: params.loading,
    activeOptionId,
    registeredOptions: params.collection.registeredOptions,
    open,
    close,
    toggle,
    select,
    deselect,
    clear,
    registerOption: params.collection.register,
    unregisterOption: params.collection.unregister,
    setActiveOptionId: (id) => {
      activeOptionId.value = id;
    },
  };

  return { context };
}
