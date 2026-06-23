import type { AssembledSelectProps } from "@/types/assembled";
import type { SelectModelValue } from "@/types/model";
import type { SelectOption } from "@/types/option";

import { render } from "vitest-browser-vue";
import { ref } from "vue";

import Select from "../assembled/Select.vue";
import {
  cleanupTeleportedSelectContent,
  createContainerQueries,
  findRenderedOptionElements,
  getPopoverAriaHidden,
  getTeleportedPopoverElement,
} from "./browser-select-helpers";
import { basicOptions } from "./render-primitive-select";
import "../styles.css";

export type RenderAssembledSelectOptions<
  OptionValue extends string | number = string,
  GenericOption = SelectOption<OptionValue>,
> = Partial<AssembledSelectProps<GenericOption, OptionValue>> & {
  modelValue?: SelectModelValue<OptionValue>;
  attrs?: Record<string, unknown>;
  onSearch?: (value: string) => void;
  onMenuOpened?: () => void;
  onMenuClosed?: () => void;
  onOptionSelected?: (option: GenericOption) => void;
  onOptionDeselected?: (option: GenericOption | null) => void;
  onCreate?: (value: string) => void;
  slots?: Record<string, unknown>;
};

export async function renderAssembledSelect<
  OptionValue extends string | number = string,
  GenericOption = SelectOption<OptionValue>,
>(props: RenderAssembledSelectOptions<OptionValue, GenericOption> = {}) {
  const { modelValue = null, attrs, slots, onSearch, onMenuOpened, onMenuClosed, onOptionSelected, onOptionDeselected, onCreate, ...restProps } = props;
  const model = ref<SelectModelValue<OptionValue>>(modelValue);

  const screen = await render(Select<OptionValue, GenericOption>, {
    props: {
      "options": [...basicOptions] as GenericOption[],
      "placeholder": "Pick a language",
      ...restProps,
      "modelValue": modelValue,
      "onUpdate:modelValue": (value: SelectModelValue<OptionValue>) => {
        model.value = value;
        void screen.rerender({ modelValue: value } as Partial<AssembledSelectProps<GenericOption, OptionValue>>);
      },
      onSearch,
      onMenuOpened,
      onMenuClosed,
      onOptionSelected,
      onOptionDeselected,
      onCreate,
    },
    attrs,
    slots,
  });

  const queries = createContainerQueries(screen);

  return {
    screen,
    model,
    getTrigger: queries.trigger,
    getValue: queries.value,
    getInput: queries.input,
    getListbox: queries.listbox,
    getClearButton: queries.clear,
    findVisibleOptions: () => findRenderedOptionElements(),
    findRenderedOptionElements,
    getPopoverAriaHidden: () => getPopoverAriaHidden(screen.container),
    getTeleportedPopoverElement,
    async openMenu() {
      await queries.trigger().click();
    },
    async unmount() {
      await screen.unmount();
      cleanupTeleportedSelectContent();
    },
  };
}
