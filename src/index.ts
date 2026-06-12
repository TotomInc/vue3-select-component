export { default as Select } from "./assembled/Select.vue";

export type { CreateItemMode } from "./lib/create-item";

export {
  SelectClear,
  SelectCreateItem,
  SelectGroup,
  SelectGroupLabel,
  SelectIcon,
  SelectInput,
  SelectListbox,
  SelectNoOptions,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectSeparator,
  SelectTag,
  SelectTrailingIcon,
  SelectTrigger,
  SelectValue,
} from "./primitives";
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
export type {
  AssembledSelectSlots,
  SelectClearSlots,
  SelectCreateItemSlots,
  SelectDefaultSlots,
  SelectGroupLabelSlots,
  SelectGroupSlots,
  SelectIconSlots,
  SelectNoOptionsSlots,
  SelectOptionSlots,
  SelectSearchValueSlotProps,
  SelectSeparatorSlots,
  SelectTagRemoveSlotProps,
  SelectTagSlots,
  SelectTrailingIconSlotProps,
  SelectTrailingIconSlots,
  SelectValueDefaultSlotProps,
  SelectValueSlots,
} from "./types/slots";
