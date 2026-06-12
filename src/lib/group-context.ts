import type { ComputedRef, InjectionKey, Ref } from "vue";

import { inject, provide } from "vue";

export type SelectGroupContext<OptionValue = string> = {
  groupId: string;
  labelId: string;
  labelledBy: ComputedRef<string | undefined>;
  isVisible: ComputedRef<boolean>;
  hasLabel: Ref<boolean>;
  registerLabel: () => void;
  unregisterLabel: () => void;
  registerOptionValue: (value: OptionValue) => void;
  unregisterOptionValue: (value: OptionValue) => void;
};

const SELECT_GROUP_CONTEXT_KEY: InjectionKey<SelectGroupContext<unknown>> = Symbol("select-group-context");

export function provideSelectGroupContext<OptionValue>(context: SelectGroupContext<OptionValue>) {
  provide(SELECT_GROUP_CONTEXT_KEY, context as SelectGroupContext<unknown>);
}

export function injectSelectGroupContext<OptionValue = string>(): SelectGroupContext<OptionValue> {
  const context = inject(SELECT_GROUP_CONTEXT_KEY);

  if (!context) {
    throw new Error("injectSelectGroupContext must be used within SelectGroup");
  }

  return context as SelectGroupContext<OptionValue>;
}

export function injectOptionalSelectGroupContext<OptionValue = string>(): SelectGroupContext<OptionValue> | null {
  return inject(SELECT_GROUP_CONTEXT_KEY, null) as SelectGroupContext<OptionValue> | null;
}
