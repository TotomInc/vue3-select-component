import type { SelectModelValue } from "./types/model";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";

import SelectClear from "./primitives/SelectClear.vue";
import SelectListbox from "./primitives/SelectListbox.vue";
import SelectOption from "./primitives/SelectOption.vue";
import SelectPopover from "./primitives/SelectPopover.vue";
import SelectRoot from "./primitives/SelectRoot.vue";
import SelectTrigger from "./primitives/SelectTrigger.vue";
import SelectValue from "./primitives/SelectValue.vue";

const options = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
] as const;

function mountPrimitiveSelect(props: {
  modelValue?: string | null;
  clearable?: boolean;
  multiple?: boolean;
} = {}) {
  const model = ref<SelectModelValue<string>>(props.modelValue ?? null);

  const wrapper = mount(SelectRoot<string>, {
    props: {
      "modelValue": props.modelValue ?? null,
      "clearable": props.clearable ?? false,
      "multiple": props.multiple ?? false,
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
          default: () => h(SelectListbox, null, {
            default: () => options.map((option) =>
              h(SelectOption, {
                value: option.value,
                label: option.label,
              }),
            ),
          }),
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
    expect(wrapper.find("[data-v1-select-value]").text()).toBe("Pick a language");
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
