import type { CreateItemMode } from "../lib/create-item";
import type { FilterByFn } from "../lib/filter";
import type { SelectModelValue } from "./model";
import type { SelectOption } from "./option";

export type SelectRootProps<OptionValue = string> = {
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  loading?: boolean;
  closeOnSelect?: boolean | null;
  resetSearchOnBlur?: boolean;
  resetSearchOnSelect?: boolean;
  hideSelected?: boolean;
  createItem?: CreateItemMode;
  options?: SelectOption<OptionValue>[];
  filterBy?: FilterByFn<OptionValue>;
};

export type SelectRootEmits<OptionValue = string> = {
  "update:modelValue": [value: SelectModelValue<OptionValue>];
  "menuOpened": [];
  "menuClosed": [];
  "search": [value: string];
  "create": [value: string];
  "optionSelected": [value: OptionValue];
  "optionDeselected": [value: OptionValue | null];
};
