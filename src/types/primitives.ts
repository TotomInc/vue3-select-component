import type { PopoverContentProps } from "reka-ui";

export type SelectOptionProps<OptionValue = string> = {
  value: OptionValue;
  label: string;
  disabled?: boolean;
};

export type SelectValueProps = {
  placeholder?: string;
};

export type SelectPopoverTeleportTarget = boolean | string | HTMLElement;

type SelectPopoverPositionProps = Pick<
  PopoverContentProps,
  | "side"
  | "sideOffset"
  | "sideFlip"
  | "align"
  | "alignOffset"
  | "alignFlip"
  | "avoidCollisions"
  | "collisionBoundary"
  | "collisionPadding"
  | "positionStrategy"
  | "updatePositionStrategy"
  | "sticky"
  | "hideWhenDetached"
  | "prioritizePosition"
>;

export type SelectPopoverProps = SelectPopoverPositionProps & {
  /**
   * Teleport the popover out of the component DOM tree.
   * `true` (default) teleports to `body`. Pass a CSS selector or `HTMLElement` for a custom target.
   * Set to `false` to render inline (useful for SSR or custom layout constraints).
   */
  teleport?: SelectPopoverTeleportTarget;
};
