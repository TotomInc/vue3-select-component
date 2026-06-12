export { default as Select } from "./assembled/Select.vue";

export {
  SelectClear,
  SelectCreateItem,
  SelectIcon,
  SelectInput,
  SelectListbox,
  SelectNoOptions,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectTag,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "./primitives";

export type { CreateItemMode } from "./lib/create-item";
export type { AssembledSelectEmits, AssembledSelectProps } from "./types/assembled";
export type { SelectModelValue } from "./types/model";
export type { SelectOption as SelectOptionData } from "./types/option";
export type {
  SelectPopoverContentProps,
  SelectPopoverPortalProps,
  SelectPopoverProps,
  SelectPopoverRootProps,
} from "./types/primitives";
export type { SelectRootEmits, SelectRootProps } from "./types/root";
