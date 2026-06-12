export { default as Select } from "./assembled/Select.vue";

export {
  SelectClear,
  SelectIndicator,
  SelectInput,
  SelectListbox,
  SelectNoOptions,
  SelectOption,
  SelectPopover,
  SelectRoot,
  SelectTag,
  SelectTrigger,
  SelectValue,
} from "./primitives";

export type { AssembledSelectEmits, AssembledSelectProps } from "./types/assembled";
export type { SelectModelValue } from "./types/model";
export type { SelectOption as SelectOptionData } from "./types/option";
export type { SelectRootEmits, SelectRootProps } from "./types/root";
