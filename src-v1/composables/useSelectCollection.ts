import type { SelectOption } from "../types/option";

import { createPropOptionId } from "@v1/lib/ids";
import { computed, shallowRef } from "vue";

export type RegisteredOption<Value> = {
  id: string;
  value: Value;
  label: string;
  disabled: boolean;
};

type UseSelectCollectionParams<Value> = {
  propOptions: () => readonly SelectOption<Value>[];
};

function toRegisteredOption<Value extends string | number>(option: SelectOption<Value>): RegisteredOption<Value> {
  return {
    id: createPropOptionId(option.value),
    value: option.value,
    label: option.label,
    disabled: option.disabled ?? false,
  };
}

export function useSelectCollection<Value extends string | number>(params: UseSelectCollectionParams<Value>) {
  const declarativeRegistry = shallowRef(new Map<string, RegisteredOption<Value>>());

  const register = (option: RegisteredOption<Value>) => {
    const nextRegistry = new Map(declarativeRegistry.value);
    nextRegistry.set(option.id, option);
    declarativeRegistry.value = nextRegistry;
  };

  const unregister = (id: string) => {
    const nextRegistry = new Map(declarativeRegistry.value);
    nextRegistry.delete(id);
    declarativeRegistry.value = nextRegistry;
  };

  const propOptions = computed(() => params.propOptions().map(toRegisteredOption));

  const allOptions = computed(() => {
    const byValue = new Map<string, RegisteredOption<Value>>();

    for (const option of propOptions.value) {
      byValue.set(String(option.value), option);
    }

    for (const option of declarativeRegistry.value.values()) {
      if (!byValue.has(String(option.value))) {
        byValue.set(String(option.value), option);
      }
    }

    return [...byValue.values()];
  });

  return {
    register,
    unregister,
    allOptions,
  };
}

export function getEnabledOptions<Value>(options: readonly RegisteredOption<Value>[]) {
  return options.filter((option) => !option.disabled);
}

export function findNextEnabledOption<Value>(
  options: readonly RegisteredOption<Value>[],
  currentValue: Value | null,
  direction: 1 | -1,
): RegisteredOption<Value> | null {
  const enabledOptions = getEnabledOptions(options);

  if (enabledOptions.length === 0) {
    return null;
  }

  const currentIndex = currentValue == null
    ? -1
    : enabledOptions.findIndex((option) => option.value === currentValue);

  const nextIndex = currentIndex === -1
    ? (direction === 1 ? 0 : enabledOptions.length - 1)
    : (currentIndex + direction + enabledOptions.length) % enabledOptions.length;

  return enabledOptions[nextIndex] ?? null;
}
