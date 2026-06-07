import type { SelectModelValue } from "./types/model";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";

import SelectClear from "./primitives/SelectClear.vue";
import SelectInput from "./primitives/SelectInput.vue";
import SelectListbox from "./primitives/SelectListbox.vue";
import SelectNoOptions from "./primitives/SelectNoOptions.vue";
import SelectOption from "./primitives/SelectOption.vue";
import SelectPopover from "./primitives/SelectPopover.vue";
import SelectRoot from "./primitives/SelectRoot.vue";
import SelectTrigger from "./primitives/SelectTrigger.vue";
import SelectValue from "./primitives/SelectValue.vue";

const basicOptions = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
] as const;

const optionsWithDisabled = [
  { label: "JavaScript", value: "js" },
  { label: "Spain", value: "es", disabled: true },
  { label: "TypeScript", value: "ts" },
] as const;

function mountPrimitiveSelect(props: {
  modelValue?: string | string[] | null;
  clearable?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  usePropOptions?: boolean;
  selectOptions?: typeof basicOptions | typeof optionsWithDisabled;
} = {}) {
  const selectOptions = props.selectOptions ?? basicOptions;
  const model = ref<SelectModelValue<string>>(props.modelValue ?? null);

  const wrapper = mount(SelectRoot<string>, {
    props: {
      "modelValue": props.modelValue ?? null,
      "clearable": props.clearable ?? false,
      "multiple": props.multiple ?? false,
      "searchable": props.searchable ?? false,
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
            h(SelectValue, { placeholder: "Pick a language" }),
            h(SelectClear),
          ],
        }),
        h(SelectPopover, null, {
          default: () => [
            h(SelectInput),
            h(SelectListbox, null, {
              default: () => [
                h(SelectNoOptions),
                ...selectOptions.map((option) =>
                  h(SelectOption, {
                    value: option.value,
                    label: option.label,
                    disabled: "disabled" in option ? option.disabled : false,
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

describe("v1 SelectRoot foundation", () => {
  it("renders the root shell and provides context to child primitives", () => {
    const { wrapper } = mountPrimitiveSelect();

    expect(wrapper.find("[data-v1-select-root]").exists()).toBe(true);
    expect(wrapper.find("[data-v1-select-trigger]").exists()).toBe(true);
    expect(wrapper.get("[data-v1-select-value]").text()).toBe("Pick a language");
  });

  it("toggles menu open state from the trigger", async () => {
    const { wrapper } = mountPrimitiveSelect();

    const trigger = wrapper.get("[data-v1-select-trigger]");

    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find("[data-v1-select-popover]").exists()).toBe(false);

    await trigger.trigger("click");

    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find("[data-v1-select-popover]").exists()).toBe(true);
    expect(wrapper.findAll("[data-v1-select-option]")).toHaveLength(2);
  });

  it("updates v-model on single selection and closes the menu", async () => {
    const { wrapper, model } = mountPrimitiveSelect();

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-option][data-value='ts']").trigger("click");

    expect(model.value).toBe("ts");
    expect(wrapper.get("[data-v1-select-value]").text()).toBe("ts");
    expect(wrapper.find("[data-v1-select-popover]").exists()).toBe(false);
  });

  it("registers declarative options in the collection", async () => {
    const { wrapper } = mountPrimitiveSelect();

    await wrapper.get("[data-v1-select-trigger]").trigger("click");

    expect(wrapper.find("[data-v1-select-no-options]").exists()).toBe(false);
    expect(wrapper.findAll("[role='option']")).toHaveLength(2);
  });

  it("clears the model when clearable is enabled", async () => {
    const { wrapper, model } = mountPrimitiveSelect({ modelValue: "js", clearable: true });

    expect(wrapper.find("[data-v1-select-clear]").exists()).toBe(true);

    await wrapper.get("[data-v1-select-clear]").trigger("click");

    expect(model.value).toBeNull();
    expect(wrapper.get("[data-v1-select-value]").text()).toBe("Pick a language");
  });

  it("throws when a primitive is used outside SelectRoot", () => {
    const OrphanTrigger = defineComponent({
      render: () => h(SelectTrigger),
    });

    expect(() => mount(OrphanTrigger)).toThrow("injectSelectContext must be used within SelectRoot");
  });
});

describe("v1 SelectRoot core module", () => {
  it("supports multi-select toggling without closing the menu", async () => {
    const { wrapper, model } = mountPrimitiveSelect({ multiple: true });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-option][data-value='js']").trigger("click");
    await wrapper.get("[data-v1-select-option][data-value='ts']").trigger("click");

    expect(model.value).toEqual(["js", "ts"]);
    expect(wrapper.find("[data-v1-select-popover]").exists()).toBe(true);

    await wrapper.get("[data-v1-select-option][data-value='js']").trigger("click");

    expect(model.value).toEqual(["ts"]);
  });

  it("navigates with arrow keys and skips disabled options", async () => {
    const { wrapper } = mountPrimitiveSelect({ selectOptions: optionsWithDisabled });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-listbox]").trigger("keydown", { key: "ArrowDown" });

    expect(wrapper.get("[data-v1-select-option][data-active='true']").attributes("data-value")).toBe("ts");

    await wrapper.get("[data-v1-select-listbox]").trigger("keydown", { key: "ArrowUp" });

    expect(wrapper.get("[data-v1-select-option][data-active='true']").attributes("data-value")).toBe("js");
  });

  it("selects the active option on Enter", async () => {
    const { wrapper, model } = mountPrimitiveSelect();

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-listbox]").trigger("keydown", { key: "ArrowDown" });
    await wrapper.get("[data-v1-select-listbox]").trigger("keydown", { key: "Enter" });

    expect(model.value).toBe("ts");
    expect(wrapper.find("[data-v1-select-popover]").exists()).toBe(false);
  });

  it("opens the menu from the trigger with ArrowDown", async () => {
    const { wrapper } = mountPrimitiveSelect();

    await wrapper.get("[data-v1-select-trigger]").trigger("keydown", { key: "ArrowDown" });

    expect(wrapper.find("[data-v1-select-popover]").exists()).toBe(true);
  });

  it("filters options and keeps the active option in the filtered set", async () => {
    const { wrapper } = mountPrimitiveSelect({ searchable: true });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-input]").setValue("type");
    await wrapper.get("[data-v1-select-listbox]").trigger("keydown", { key: "ArrowDown" });

    expect(wrapper.findAll("[data-v1-select-option]")).toHaveLength(1);
    expect(wrapper.get("[data-v1-select-option]").attributes("data-value")).toBe("ts");
    expect(wrapper.get("[data-v1-select-option][data-active='true']").attributes("data-value")).toBe("ts");
  });

  it("shows the empty state when filtering removes every option", async () => {
    const { wrapper } = mountPrimitiveSelect({ searchable: true });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-input]").setValue("zzzz");

    expect(wrapper.find("[data-v1-select-no-options]").exists()).toBe(true);
    expect(wrapper.findAll("[data-v1-select-option]")).toHaveLength(0);
  });

  it("resolves options from the options prop without declarative duplicates", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "options": [...optionsWithDisabled],
        "searchable": true,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, null, {
            default: () => [
              h(SelectInput),
              h(SelectListbox, null, {
                default: () => [
                  h(SelectNoOptions),
                  ...optionsWithDisabled.map((option) =>
                    h(SelectOption, {
                      value: option.value,
                      label: option.label,
                      disabled: "disabled" in option ? option.disabled : false,
                    }),
                  ),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-input]").setValue("type");

    expect(wrapper.findAll("[data-v1-select-option]")).toHaveLength(1);
    expect(wrapper.get("[data-v1-select-option]").attributes("data-value")).toBe("ts");
  });

  it("removes the last selected value on Backspace in multi-select mode", async () => {
    const { wrapper, model } = mountPrimitiveSelect({
      multiple: true,
      modelValue: ["js", "ts"],
    });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-listbox]").trigger("keydown", { key: "Backspace" });

    expect(model.value).toEqual(["js"]);
  });
});
