import type { RegisteredOption } from "@/composables/useSelectCollection";

export type SelectTagRemoveSlotProps = {
  label: string;
  value: string | number;
};

export type SelectTrailingIconSlotProps = {
  open: boolean;
  loading: boolean;
};

export type SelectSearchValueSlotProps = {
  searchValue: string;
};

export type SelectValueDefaultSlotProps<OptionValue extends string | number = string> = {
  selectedOptions: readonly RegisteredOption<OptionValue>[];
};

export type AssembledSelectSlots = {
  "icon"?: () => any;
  "tag-remove"?: (props: SelectTagRemoveSlotProps) => any;
  "trailing-icon"?: (props: SelectTrailingIconSlotProps) => any;
  "clear"?: () => any;
  "no-options"?: (props: SelectSearchValueSlotProps) => any;
  "create-item"?: (props: SelectSearchValueSlotProps) => any;
};

export type SelectValueSlots<OptionValue extends string | number = string> = {
  "default"?: (props: SelectValueDefaultSlotProps<OptionValue>) => any;
  "tag-remove"?: (props: SelectTagRemoveSlotProps) => any;
};

export type SelectTagSlots = {
  default?: (props: SelectTagRemoveSlotProps) => any;
  remove?: (props: SelectTagRemoveSlotProps) => any;
};

export type SelectOptionSlots = {
  default?: () => any;
  checkmark?: () => any;
};

export type SelectTrailingIconSlots = {
  default?: (props: SelectTrailingIconSlotProps) => any;
};

export type SelectNoOptionsSlots = {
  default?: (props: SelectSearchValueSlotProps) => any;
};

export type SelectCreateItemSlots = {
  default?: (props: SelectSearchValueSlotProps) => any;
};

export type SelectClearSlots = {
  default?: () => any;
};

export type SelectIconSlots = {
  default?: () => any;
};

export type SelectDefaultSlots = {
  default?: () => any;
};
