export type SelectOptionProps<OptionValue = string> = {
  value: OptionValue;
  label: string;
  disabled?: boolean;
};

export type SelectValueProps = {
  placeholder?: string;
};

export type SelectPopoverProps = {
  teleport?: boolean | string;
};
