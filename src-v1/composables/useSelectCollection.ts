import { computed, shallowRef } from "vue";

export type RegisteredOption<Value> = {
  id: string;
  value: Value;
  label: string;
  disabled: boolean;
};

export function useSelectCollection<Value>() {
  const registry = shallowRef(new Map<string, RegisteredOption<Value>>());

  const register = (option: RegisteredOption<Value>) => {
    registry.value.set(option.id, option);
  };

  const unregister = (id: string) => {
    registry.value.delete(id);
  };

  const registeredOptions = computed(() => [...registry.value.values()]);

  return {
    register,
    unregister,
    registeredOptions,
  };
}
