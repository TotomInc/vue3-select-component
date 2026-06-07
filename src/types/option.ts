export type SelectOption<Value = string> = {
  label: string;
  value: Value;
  disabled?: boolean;
};
