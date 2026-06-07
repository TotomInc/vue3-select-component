import type { RegisteredOption } from "../composables/useSelectCollection";
import type { SelectOption } from "../types/option";

import type { FilterByFn } from "./filter";

import { defaultSelectFilterBy } from "./filter";

export type OptionMapper<GenericOption, OptionValue> = {
  getOptionValue: (option: GenericOption) => OptionValue;
  getOptionLabel: (option: GenericOption) => string;
};

export type GenericFilterByFn<GenericOption> = (
  option: GenericOption,
  label: string,
  search: string,
) => boolean;

function readOptionDisabled<GenericOption>(option: GenericOption): boolean | undefined {
  if (option && typeof option === "object" && "disabled" in option) {
    return Boolean((option as { disabled?: boolean }).disabled);
  }

  return undefined;
}

export function createOptionMappers<GenericOption, OptionValue>(
  mappers?: Partial<OptionMapper<GenericOption, OptionValue>>,
): OptionMapper<GenericOption, OptionValue> {
  const getOptionValue = mappers?.getOptionValue
    ?? ((option: GenericOption) => (option as GenericOption & { value: OptionValue }).value);
  const getOptionLabel = mappers?.getOptionLabel
    ?? ((option: GenericOption) => (option as GenericOption & { label: string }).label);

  return { getOptionValue, getOptionLabel };
}

export function normalizeSelectOptions<GenericOption, OptionValue>(
  options: readonly GenericOption[],
  mappers: OptionMapper<GenericOption, OptionValue>,
): SelectOption<OptionValue>[] {
  return options.map((option) => ({
    value: mappers.getOptionValue(option),
    label: mappers.getOptionLabel(option),
    disabled: readOptionDisabled(option),
  }));
}

export function createGenericFilterByAdapter<GenericOption, OptionValue>(
  options: readonly GenericOption[],
  mappers: OptionMapper<GenericOption, OptionValue>,
  filterBy?: GenericFilterByFn<GenericOption>,
): FilterByFn<OptionValue> {
  const sourceByValue = new Map(
    options.map((option) => [
      mappers.getOptionValue(option),
      { source: option, label: mappers.getOptionLabel(option) },
    ]),
  );

  return (registered: RegisteredOption<OptionValue>, search: string) => {
    const entry = sourceByValue.get(registered.value);

    if (!entry) {
      return defaultSelectFilterBy(registered, search);
    }

    if (filterBy) {
      return filterBy(entry.source, entry.label, search);
    }

    return defaultSelectFilterBy(registered, search);
  };
}

export function findSourceOptionByValue<GenericOption, OptionValue>(
  options: readonly GenericOption[],
  mappers: OptionMapper<GenericOption, OptionValue>,
  value: OptionValue,
): GenericOption | undefined {
  return options.find((option) => mappers.getOptionValue(option) === value);
}
