import type { SelectModelValue } from "@/types/model";

import { mount } from "@vue/test-utils";
import { h, ref } from "vue";

import SelectClear from "../primitives/SelectClear.vue";
import SelectIndicator from "../primitives/SelectIndicator.vue";
import SelectInput from "../primitives/SelectInput.vue";
import SelectListbox from "../primitives/SelectListbox.vue";
import SelectNoOptions from "../primitives/SelectNoOptions.vue";
import SelectOption from "../primitives/SelectOption.vue";
import SelectPopover from "../primitives/SelectPopover.vue";
import SelectRoot from "../primitives/SelectRoot.vue";
import SelectTrigger from "../primitives/SelectTrigger.vue";
import SelectValue from "../primitives/SelectValue.vue";

export const basicOptions = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
] as const;

export const optionsWithDisabled = [
  { label: "JavaScript", value: "js" },
  { label: "Spain", value: "es", disabled: true },
  { label: "TypeScript", value: "ts" },
] as const;

export type PrimitiveSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type MountPrimitiveSelectOptions = {
  modelValue?: string | string[] | null;
  clearable?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  usePropOptions?: boolean;
  selectOptions?: readonly PrimitiveSelectOption[];
  placeholder?: string;
};

export function mountPrimitiveSelect(props: MountPrimitiveSelectOptions = {}) {
  const selectOptions = props.selectOptions ?? basicOptions;
  const model = ref<SelectModelValue<string>>(props.modelValue ?? null);

  const wrapper = mount(SelectRoot<string>, {
    props: {
      "modelValue": props.modelValue ?? null,
      "clearable": props.clearable ?? false,
      "multiple": props.multiple ?? false,
      "searchable": props.searchable ?? false,
      "disabled": props.disabled ?? false,
      "loading": props.loading ?? false,
      "options": props.usePropOptions ? [...selectOptions] : [],
      "onUpdate:modelValue": (value: SelectModelValue<string>) => {
        model.value = value;
        wrapper.setProps({ modelValue: value });
      },
    },
    slots: {
      default: () => [
        h(SelectTrigger, null, {
          default: () => [
            h(SelectValue, { placeholder: props.placeholder ?? "Pick a language" }),
            h(SelectIndicator),
            h(SelectClear),
          ],
        }),
        h(SelectPopover, { teleport: false }, {
          default: () => [
            h(SelectInput),
            h(SelectListbox, null, {
              default: () => [
                h(SelectNoOptions),
                ...selectOptions.map((option) =>
                  h(SelectOption, {
                    value: option.value,
                    label: option.label,
                    disabled: "disabled" in option ? option.disabled ?? false : false,
                  }),
                ),
              ],
            }),
          ],
        }),
      ],
    },
  });

  return { wrapper, model };
}
