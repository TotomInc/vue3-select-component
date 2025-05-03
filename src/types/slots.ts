import type { Option } from "@/types/option";

/**
 * Define all existing slots across all internal components.
 *
 * @see https://vuejs.org/api/sfc-script-setup#defineslots
 */
export type Slots<GenericOption extends Option<OptionValue>, OptionValue> = {
  "value": (props: { option: GenericOption }) => any;
  "tag": (props: { option: GenericOption; removeOption: () => void }) => any;
  "clear": () => any;
  "dropdown": () => any;
  "loading": () => any;
  "menu-header": () => any;
  "option": (props: { option: GenericOption; index: number; isFocused: boolean; isSelected: boolean; isDisabled: boolean }) => any;
  "no-options": () => any;
  "taggable-no-options": () => any;
};

export type IndicatorsSlots<GenericOption extends Option<OptionValue>, OptionValue> = Pick<
  Slots<GenericOption, OptionValue>,
  "clear" | "dropdown" | "loading"
>;

export type MenuSlots<GenericOption extends Option<OptionValue>, OptionValue> = Pick<
  Slots<GenericOption, OptionValue>,
  "menu-header" | "option" | "no-options" | "taggable-no-options"
>;
