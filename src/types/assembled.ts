import type { GenericFilterByFn, OptionMapper } from "../lib/normalize-options";
import type { SelectOption } from "./option";

export type AssembledSelectProps<
  GenericOption = SelectOption<string>,
  OptionValue extends string | number = string,
> = {
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  options: GenericOption[];
  placeholder?: string;
  teleport?: boolean | string | HTMLElement;
  closeOnSelect?: boolean | null;
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
