import type { GenericFilterByFn, OptionMapper } from "../lib/normalize-options";
import type { SelectOption } from "./option";
import type { SelectPopoverProps } from "./primitives";

export type AssembledSelectBehaviorProps<
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
  closeOnSelect?: boolean | null;
  resetSearchOnBlur?: boolean;
  resetSearchOnSelect?: boolean;
  hideSelected?: boolean;
  filterBy?: GenericFilterByFn<GenericOption>;
  getOptionValue?: OptionMapper<GenericOption, OptionValue>["getOptionValue"];
  getOptionLabel?: OptionMapper<GenericOption, OptionValue>["getOptionLabel"];
};

export type AssembledSelectProps<
  GenericOption = SelectOption<string>,
  OptionValue extends string | number = string,
> = AssembledSelectBehaviorProps<GenericOption, OptionValue> & SelectPopoverProps;

export type AssembledSelectEmits<GenericOption> = {
  optionSelected: [option: GenericOption];
  optionDeselected: [option: GenericOption | null];
  menuOpened: [];
  menuClosed: [];
  search: [value: string];
};
