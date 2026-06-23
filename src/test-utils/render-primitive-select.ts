import type { SelectModelValue } from "@/types/model";

import { render } from "vitest-browser-vue";
import { h, ref } from "vue";

import SelectClear from "../primitives/SelectClear.vue";
import SelectInput from "../primitives/SelectInput.vue";
import SelectListbox from "../primitives/SelectListbox.vue";
import SelectNoOptions from "../primitives/SelectNoOptions.vue";
import SelectOption from "../primitives/SelectOption.vue";
import SelectPopover from "../primitives/SelectPopover.vue";
import SelectRoot from "../primitives/SelectRoot.vue";
import SelectTrailingIcon from "../primitives/SelectTrailingIcon.vue";
import SelectTrigger from "../primitives/SelectTrigger.vue";
import SelectValue from "../primitives/SelectValue.vue";
import {
  createContainerQueries,
  getPopoverAriaHidden,
  locateInContainer,
} from "./browser-select-helpers";

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

export type RenderPrimitiveSelectOptions = {
  modelValue?: string | string[] | null;
  clearable?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  hideSelected?: boolean;
  usePropOptions?: boolean;
  selectOptions?: readonly PrimitiveSelectOption[];
  placeholder?: string;
  teleport?: boolean | string;
};

export async function renderPrimitiveSelect(props: RenderPrimitiveSelectOptions = {}) {
  const selectOptions = props.selectOptions ?? basicOptions;
  const model = ref<SelectModelValue<string>>(props.modelValue ?? null);

  const screen = await render(SelectRoot<string>, {
    props: {
      "modelValue": props.modelValue ?? null,
      "clearable": props.clearable ?? false,
      "multiple": props.multiple ?? false,
      "searchable": props.searchable ?? false,
      "disabled": props.disabled ?? false,
      "loading": props.loading ?? false,
      "hideSelected": props.hideSelected ?? false,
      "options": props.usePropOptions ? [...selectOptions] : [],
      "onUpdate:modelValue": (value: SelectModelValue<string>) => {
        model.value = value;
        void screen.rerender({ modelValue: value });
      },
    },
    slots: {
      default: () => [
        h(SelectTrigger, null, {
          default: () => [
            h(SelectValue, { placeholder: props.placeholder ?? "Pick a language" }),
            h(SelectInput),
            h(SelectTrailingIcon),
            h(SelectClear),
          ],
        }),
        h(SelectPopover, { teleport: props.teleport ?? false }, {
          default: () => [
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

  const queries = createContainerQueries(screen);

  return {
    screen,
    model,
    getTrigger: queries.trigger,
    getValue: queries.value,
    getInput: queries.input,
    getListbox: () => locateInContainer(screen.container, "[data-select-listbox]"),
    getPopover: queries.popover,
    getPopoverAriaHidden: () => getPopoverAriaHidden(screen.container),
  };
}

export type RenderSelectRootOptions = {
  props?: Record<string, unknown>;
  slots?: Record<string, unknown>;
};

export async function renderSelectRoot(options: RenderSelectRootOptions = {}) {
  const modelValue = (options.props?.modelValue ?? null) as SelectModelValue<string>;
  const model = ref<SelectModelValue<string>>(modelValue);

  const screen = await render(SelectRoot<string>, {
    props: {
      ...options.props,
      "modelValue": modelValue,
      "onUpdate:modelValue": (value: SelectModelValue<string>) => {
        model.value = value;
        void screen.rerender({ modelValue: value });
      },
    },
    slots: options.slots,
  });

  const queries = createContainerQueries(screen);

  return {
    screen,
    model,
    getTrigger: queries.trigger,
    getValue: queries.value,
    getInput: queries.input,
    getListbox: () => locateInContainer(screen.container, "[data-select-listbox]"),
    getPopover: queries.popover,
    getPopoverAriaHidden: () => getPopoverAriaHidden(screen.container),
  };
}
