import type {
  PopoverContentProps,
  PopoverPortalProps,
  PopoverRootProps,
} from "reka-ui";

export type SelectOptionProps<OptionValue = string> = {
  value: OptionValue;
  label: string;
  disabled?: boolean;
};

export type SelectValueProps = {
  placeholder?: string;
};

export type SelectInputProps = {
  id?: string;
  placeholder?: string;
};

export type SelectPopoverTeleportTarget = boolean | string | HTMLElement;

/**
 * Props forwarded to reka-ui `PopoverContent`.
 * Open state, anchor reference, `as`/`asChild`, and `forceMount` are managed internally.
 */
export type SelectPopoverContentProps = Omit<
  PopoverContentProps,
  "as" | "asChild" | "forceMount" | "reference"
>;

/**
 * Props forwarded to reka-ui `PopoverRoot`.
 * `open` is controlled by select context.
 */
export type SelectPopoverRootProps = Pick<PopoverRootProps, "modal">;

/**
 * Props forwarded to reka-ui `PopoverPortal`.
 * `to` and `disabled` are driven by the `teleport` prop.
 */
export type SelectPopoverPortalProps = Pick<PopoverPortalProps, "defer">;

export type SelectPopoverProps = SelectPopoverContentProps
  & SelectPopoverRootProps
  & SelectPopoverPortalProps & {
    /**
     * Teleport the popover out of the component DOM tree.
     * `true` (default) teleports to `body`. Pass a CSS selector or `HTMLElement` for a custom target.
     * Set to `false` to render inline (useful for SSR or custom layout constraints).
     */
    teleport?: SelectPopoverTeleportTarget;
  };
