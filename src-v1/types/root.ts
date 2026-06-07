import type { SelectModelValue } from "./model";
import type { SelectOption } from "./option";

export type SelectRootProps<OptionValue = string> = {
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  loading?: boolean;
  options?: SelectOption<OptionValue>[];
};

export type SelectRootEmits<OptionValue = string> = {
  "update:modelValue": [value: SelectModelValue<OptionValue>];
};
