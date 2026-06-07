import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { RegisteredOption } from "../composables/useSelectCollection";
import type { SelectModelValue } from "../types/model";

import { inject, provide } from "vue";

export type SelectContext<OptionValue = string> = {
  modelValue: Ref<SelectModelValue<OptionValue>>;
  isOpen: Ref<boolean>;
  searchValue: Ref<string>;
  multiple: Ref<boolean>;
  disabled: Ref<boolean>;
  searchable: Ref<boolean>;
  clearable: Ref<boolean>;
  loading: Ref<boolean>;
  activeOptionId: Ref<string | null>;
  registeredOptions: ComputedRef<readonly RegisteredOption<OptionValue>[]>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  select: (value: OptionValue) => void;
  deselect: (value: OptionValue) => void;
  clear: () => void;
  registerOption: (option: RegisteredOption<OptionValue>) => void;
  unregisterOption: (id: string) => void;
  setActiveOptionId: (id: string | null) => void;
};

const SELECT_CONTEXT_KEY: InjectionKey<SelectContext<unknown>> = Symbol("select-context");

export function provideSelectContext<OptionValue>(context: SelectContext<OptionValue>) {
  provide(SELECT_CONTEXT_KEY, context as SelectContext<unknown>);
}

export function injectSelectContext<OptionValue = string>(): SelectContext<OptionValue> {
  const context = inject(SELECT_CONTEXT_KEY);

  if (!context) {
    throw new Error("injectSelectContext must be used within SelectRoot");
  }

  return context as SelectContext<OptionValue>;
}
