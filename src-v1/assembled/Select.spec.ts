import type { SelectModelValue } from "@v1/types/model";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { ref } from "vue";

import Select from "./Select.vue";

const options = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
] as const;

describe("v1 assembled Select", () => {
  it("composes primitives into a batteries-included select", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(Select<string>, {
      props: {
        "options": [...options],
        "placeholder": "Pick a language",
        "clearable": true,
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    expect(wrapper.find("[data-v1-assembled-select]").exists()).toBe(true);
    expect(wrapper.get("[data-v1-select-value]").text()).toBe("Pick a language");

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-option][data-value='ts']").trigger("click");

    expect(model.value).toBe("ts");
    expect(wrapper.get("[data-v1-select-value]").text()).toBe("TypeScript");
    expect(wrapper.find("[data-v1-select-clear]").exists()).toBe(true);
  });

  it("renders tags for multi-select mode", async () => {
    const model = ref<SelectModelValue<string>>([]);

    const wrapper = mount(Select<string>, {
      props: {
        "options": [...options],
        "multiple": true,
        "modelValue": [],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-option][data-value='js']").trigger("click");
    await wrapper.get("[data-v1-select-option][data-value='ts']").trigger("click");

    expect(model.value).toEqual(["js", "ts"]);
    expect(wrapper.findAll("[data-v1-select-tag]")).toHaveLength(2);
  });
});
