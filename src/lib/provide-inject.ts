import type { InjectionKey, Ref, ShallowRef } from "vue";
import type { Option } from "../types/option";

import type { Props } from "../types/props";

/**
 * This type allows you to inject the props with the correct generics
 *
 * @example
 * const props = inject<PropsInjection<GenericOption, OptionValue>>(PROPS_KEY);
 */
export type PropsInjection<GenericOption extends Option<OptionValue>, OptionValue = string> = Props<GenericOption, OptionValue>;

/**
 * This type allows you to inject the data with the correct generics
 *
 * @example
 * const data = inject<DataInjection<GenericOption, OptionValue>>(DATA_KEY);
 */
export type DataInjection<GenericOption extends Option<OptionValue>, OptionValue = string> = {
  vmodel: Ref<OptionValue | OptionValue[]>;
  availableOptions: Ref<GenericOption[]>;
  selectedOptions: Ref<GenericOption[]>;
  menuOpen: Ref<boolean>;
  focusedOption: Ref<number>;
  containerRef: Readonly<ShallowRef<HTMLDivElement | null>>;
  search: Ref<string>;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  handleControlClick: (event: MouseEvent) => void;
  handleInputMousedown: () => void;
  setOption: (option: GenericOption) => void;
  removeOption: (option: GenericOption) => void;
  createOption: () => void;
  setFocusedOption: (index: number) => void;
  handleInputBlur: () => void;
};

export const PROPS_KEY = Symbol("props") as InjectionKey<Props<any, any>>;
export const DATA_KEY = Symbol("data") as InjectionKey<DataInjection<any, any>>;
