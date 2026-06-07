/**
 * Internal v1 entry point — not yet exposed via package exports.
 * Wire `vue3-select-component/primitives` once the API stabilizes.
 */
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

export type { SelectModelValue } from "./types/model";
export type { SelectOption as SelectOptionData } from "./types/option";
export type { SelectRootProps } from "./types/root";
