import type { SelectModelValue } from "@v1/types/model";
import type { AssembledSelectProps } from "@v1/types/assembled";
import type { SelectOption } from "@v1/types/option";

import { mount } from "@vue/test-utils";
import { ref } from "vue";

import Select from "../assembled/Select.vue";
import { basicOptions } from "./mount-primitive-select";

export type MountAssembledSelectOptions<
  OptionValue extends string | number = string,
  GenericOption = SelectOption<OptionValue>,
> = Partial<AssembledSelectProps<GenericOption, OptionValue>> & {
  modelValue?: SelectModelValue<OptionValue>;
  onSearch?: (value: string) => void;
  onMenuOpened?: () => void;
  onMenuClosed?: () => void;
  onOptionSelected?: (option: GenericOption) => void;
  onOptionDeselected?: (option: GenericOption | null) => void;
};

export function mountAssembledSelect<
  OptionValue extends string | number = string,
  GenericOption = SelectOption<OptionValue>,
>(props: MountAssembledSelectOptions<OptionValue, GenericOption> = {}) {
  const { modelValue = null, ...restProps } = props;
  const model = ref<SelectModelValue<OptionValue>>(modelValue);

  const wrapper = mount(Select<OptionValue, GenericOption>, {
    props: {
      "options": [...basicOptions] as GenericOption[],
      "placeholder": "Pick a language",
      ...restProps,
      "modelValue": modelValue,
      "onUpdate:modelValue": (value: SelectModelValue<OptionValue>) => {
        model.value = value;
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  return { wrapper, model };
}
