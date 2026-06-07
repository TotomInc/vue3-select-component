import type { SelectModelValue } from "@v1/types/model";

import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import Select from "./Select.vue";

const options = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
] as const;

describe("v1 assembled Select", () => {
  it("composes primitives into a batteries-included select", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(Select<string, (typeof options)[number]>, {
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

    const wrapper = mount(Select<string, (typeof options)[number]>, {
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

  it("accepts v0 boolean prop aliases", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(Select<string, (typeof options)[number]>, {
      props: {
        "options": [...options],
        "isMulti": false,
        "isSearchable": true,
        "isClearable": true,
        "isDisabled": false,
        "isLoading": false,
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    expect(wrapper.find("[data-v1-select-input]").exists()).toBe(true);
  });

  it("maps custom option shapes with getOptionLabel and getOptionValue", async () => {
    const customOptions = [
      { id: "France", key: "fr" },
      { id: "USA", key: "us" },
    ] as const;
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(Select<string, (typeof customOptions)[number]>, {
      props: {
        "options": [...customOptions],
        "getOptionLabel": (option) => option.id,
        "getOptionValue": (option) => option.key,
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-option][data-value='us']").trigger("click");

    expect(model.value).toBe("us");
    expect(wrapper.get("[data-v1-select-value]").text()).toBe("USA");
  });

  it("emits lifecycle and selection events with source options", async () => {
    const onMenuOpened = vi.fn();
    const onMenuClosed = vi.fn();
    const onOptionSelected = vi.fn();
    const onOptionDeselected = vi.fn();
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(Select<string, (typeof options)[number]>, {
      props: {
        "options": [...options],
        "clearable": true,
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
        "onMenuOpened": onMenuOpened,
        "onMenuClosed": onMenuClosed,
        "onOptionSelected": onOptionSelected,
        "onOptionDeselected": onOptionDeselected,
      },
    });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    expect(onMenuOpened).toHaveBeenCalledTimes(1);

    await wrapper.get("[data-v1-select-option][data-value='ts']").trigger("click");
    expect(onOptionSelected).toHaveBeenCalledWith({ label: "TypeScript", value: "ts" });
    expect(onMenuClosed).toHaveBeenCalledTimes(1);

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-clear]").trigger("click");
    expect(onOptionDeselected).toHaveBeenCalledWith({ label: "TypeScript", value: "ts" });
  });

  it("filters options when searchable", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(Select<string, (typeof options)[number]>, {
      props: {
        "options": [...options],
        "searchable": true,
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
    });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-input]").setValue("type");

    expect(wrapper.findAll("[data-v1-select-option]")).toHaveLength(1);
    expect(wrapper.get("[data-v1-select-option]").attributes("data-value")).toBe("ts");
  });
});
