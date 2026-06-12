export type CreateItemMode = boolean | "always";

/**
 * Whether the create-item action should be shown in the dropdown.
 */
export function shouldShowCreateItem(
  createItem: CreateItemMode | undefined,
  searchable: boolean,
  searchValue: string,
  filteredOptionsCount: number,
): boolean {
  if (!createItem || !searchable) {
    return false;
  }

  const trimmedSearch = searchValue.trim();

  if (!trimmedSearch) {
    return false;
  }

  if (createItem === "always") {
    return true;
  }

  return filteredOptionsCount === 0;
}
