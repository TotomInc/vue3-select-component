import type { RegisteredOption } from "../composables/useSelectCollection";

type FilterByFn<Value> = (option: RegisteredOption<Value>, search: string) => boolean;

export const defaultSelectFilterBy = <Value>(option: RegisteredOption<Value>, search: string) =>
  option.label.toLowerCase().includes(search.toLowerCase());

export function filterOptions<Value>(
  options: readonly RegisteredOption<Value>[],
  search: string,
  filterBy: FilterByFn<Value> = defaultSelectFilterBy,
): RegisteredOption<Value>[] {
  const trimmedSearch = search.trim();

  if (!trimmedSearch) {
    return [...options];
  }

  return options.filter((option) => filterBy(option, trimmedSearch));
}

export type { FilterByFn };
