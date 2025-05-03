export type Option<T> = {
  label: string;
  value: T;
  disabled?: boolean;
  [key: string]: unknown;
};
