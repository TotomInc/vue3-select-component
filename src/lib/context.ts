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
  activeOptionValue: Ref<OptionValue | null>;
  triggerId: string;
  inputId: string;
  listboxId: string;
  activeOptionElementId: ComputedRef<string | undefined>;
  allOptions: ComputedRef<readonly RegisteredOption<OptionValue>[]>;
  filteredOptions: ComputedRef<readonly RegisteredOption<OptionValue>[]>;
  selectedOptions: ComputedRef<readonly RegisteredOption<OptionValue>[]>;
  showCreateItem: ComputedRef<boolean>;
  createItemSearchValue: ComputedRef<string>;
  isCreateItemActive: ComputedRef<boolean>;
  createItemElementId: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
  select: (value: OptionValue) => void;
  selectCreateItem: () => void;
  selectActiveOption: () => void;
  deselect: (value: OptionValue) => void;
  deselectLast: () => void;
  clear: () => void;
  registerOption: (option: RegisteredOption<OptionValue>) => void;
  unregisterOption: (id: string) => void;
  setActiveOptionValue: (value: OptionValue | null) => void;
  moveActiveOption: (direction: 1 | -1) => void;
  focusFirstOption: () => void;
  isOptionVisible: (value: OptionValue) => boolean;
  handleKeydown: (event: KeyboardEvent) => void;
  registerRootElement: (element: HTMLElement | null) => void;
  registerTriggerElement: (element: HTMLElement | null) => void;
  registerInputElement: (element: HTMLInputElement | null) => void;
  registerPopoverElement: (element: HTMLElement | null) => void;
  rootElement: Ref<HTMLElement | null>;
  triggerElement: Ref<HTMLElement | null>;
  inputElement: Ref<HTMLInputElement | null>;
  popoverElement: Ref<HTMLElement | null>;
};

const SELECT_CONTEXT_KEY: InjectionKey<SelectContext<unknown>> = Symbol("select-context");

export function provideSelectContext<OptionValue>(context: SelectContext<OptionValue>) {
  provide(SELECT_CONTEXT_KEY, context as SelectContext<unknown>);
}

export function injectSelectContext<OptionValue = string>(): SelectContext<OptionValue> {
  const context = inject(
    SELECT_CONTEXT_KEY,
    () => {
      throw new Error("injectSelectContext must be used within SelectRoot");
    },
    true,
  );

  return context as SelectContext<OptionValue>;
}
