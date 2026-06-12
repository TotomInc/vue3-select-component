import type { SelectModelValue } from "@/types/model";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { ref } from "vue";

import SelectPopover from "@/primitives/SelectPopover.vue";

import Select from "./Select.vue";

const options = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
] as const;

describe("v1 assembled Select", () => {
  it("closes the menu after single selection by default", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(Select<string, (typeof options)[number]>, {
      props: {
        "options": [...options],
        "teleport": false,
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option][data-value='js']").trigger("click");

    expect(model.value).toBe("js");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");
  });

  it("closes the menu on multi-select when closeOnSelect is true", async () => {
    const model = ref<SelectModelValue<string>>([]);

    const wrapper = mount(Select<string, (typeof options)[number]>, {
      props: {
        "options": [...options],
        "multiple": true,
        "closeOnSelect": true,
        "teleport": false,
        "modelValue": [],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option][data-value='js']").trigger("click");

    expect(model.value).toEqual(["js"]);
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");
  });

  it("keeps the menu open on multi-select when closeOnSelect is false", async () => {
    const model = ref<SelectModelValue<string>>([]);

    const wrapper = mount(Select<string, (typeof options)[number]>, {
      props: {
        "options": [...options],
        "multiple": true,
        "closeOnSelect": false,
        "teleport": false,
        "modelValue": [],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option][data-value='js']").trigger("click");

    expect(model.value).toEqual(["js"]);
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("false");
  });

  it("renders a chevron indicator that reflects open state", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(Select<string, (typeof options)[number]>, {
      props: {
        "options": [...options],
        "teleport": false,
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    const indicator = wrapper.get("[data-select-indicator]");

    expect(indicator.find("svg").exists()).toBe(true);
    expect(indicator.attributes("data-open")).toBe("false");

    await wrapper.get("[data-select-trigger]").trigger("click");

    expect(indicator.attributes("data-open")).toBe("true");
  });

  it("forwards popover props to SelectPopover", () => {
    const wrapper = mount(Select<string, (typeof options)[number]>, {
      props: {
        options: [...options],
        teleport: false,
        side: "top",
        align: "end",
        sideOffset: 10,
        modal: true,
      },
    });

    const popover = wrapper.getComponent(SelectPopover);

    expect(popover.props("side")).toBe("top");
    expect(popover.props("align")).toBe("end");
    expect(popover.props("sideOffset")).toBe(10);
    expect(popover.props("modal")).toBe(true);
  });
});
