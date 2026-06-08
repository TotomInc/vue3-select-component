export type SelectOptionProps<OptionValue = string> = {
  value: OptionValue;
  label: string;
  disabled?: boolean;
};

export type SelectValueProps = {
  placeholder?: string;
};

export type SelectPopoverTeleportTarget = boolean | string | HTMLElement;

export type SelectPopoverProps = {
  /**
   * Teleport the popover out of the component DOM tree.
   * `true` (default) teleports to `body`. Pass a CSS selector or `HTMLElement` for a custom target.
   * Set to `false` to render inline (useful for SSR or custom layout constraints).
   */
  teleport?: SelectPopoverTeleportTarget;
};
