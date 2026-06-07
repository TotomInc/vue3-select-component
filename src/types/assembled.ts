import type { GenericFilterByFn, OptionMapper } from "../lib/normalize-options";
import type { SelectOption } from "./option";

export type V1SelectBooleanProps = {
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export type V0SelectBooleanPropAliases = {
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export type AssembledSelectProps<
  GenericOption = SelectOption<string>,
  OptionValue extends string | number = string,
> = V1SelectBooleanProps & V0SelectBooleanPropAliases & {
  options: GenericOption[];
  placeholder?: string;
  teleport?: boolean | string;
  filterBy?: GenericFilterByFn<GenericOption>;
  getOptionValue?: OptionMapper<GenericOption, OptionValue>["getOptionValue"];
  getOptionLabel?: OptionMapper<GenericOption, OptionValue>["getOptionLabel"];
};

export type AssembledSelectEmits<GenericOption> = {
  optionSelected: [option: GenericOption];
  optionDeselected: [option: GenericOption | null];
  menuOpened: [];
  menuClosed: [];
  search: [value: string];
};

export function resolveAssembledBooleanProps(
  props: V1SelectBooleanProps & V0SelectBooleanPropAliases,
) {
  return {
    multiple: props.multiple ?? props.isMulti ?? false,
    searchable: props.searchable ?? props.isSearchable ?? false,
    clearable: props.clearable ?? props.isClearable ?? false,
    disabled: props.disabled ?? props.isDisabled ?? false,
    loading: props.loading ?? props.isLoading ?? false,
  };
}

export const V0_TO_V1_PROP_MIGRATION = {
  isMulti: "multiple",
  isSearchable: "searchable",
  isClearable: "clearable",
  isDisabled: "disabled",
  isLoading: "loading",
} as const;
