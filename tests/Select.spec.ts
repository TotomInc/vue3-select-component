import type { Option } from "../src/types/option";
import { mount } from "@vue/test-utils";

import { describe, expect, it } from "vitest";
import VueSelect from "../src/Select.vue";
import { dispatchEvent, inputSearch, openMenu } from "./utils";

const options = [
  { label: "France", value: "FR" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Germany", value: "DE" },
];

describe("input + menu interactions behavior", () => {
  it("should display the placeholder when no option is selected", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, placeholder: "Select an option" } });

    expect(wrapper.find(".input-placeholder").text()).toBe("Select an option");
  });

  it("should not open the menu when focusing the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("focus");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should not open the menu when is-disabled and an option is selected", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: options[0].value, options, isDisabled: true } });

    await openMenu(wrapper, "single-value");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should open the menu when isMenuOpen prop is set to true", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isMenuOpen: true } });

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should close the menu when isMenuOpen prop is set to false", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isMenuOpen: true } });

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    await wrapper.setProps({ isMenuOpen: false });

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });
});

describe("single-select option", () => {
  it("should select an option when clicking on it", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("should not remove the selected option when pressing backspace after typing", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);

    await inputSearch(wrapper, "F");
    await wrapper.get("input").trigger("keydown", { key: "Backspace" });

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("cannot select an option when there are no matching options", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await inputSearch(wrapper, "Foo");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("cannot select a disabled option", async () => {
    const options = [{ label: "Spain", value: "ES", disabled: true }];
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});

describe("multi-select options", () => {
  it("should select an option when clicking on it", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[[options[0].value]]]);
    expect(wrapper.get(".multi-value").element.textContent).toBe(options[0].label);
  });

  it("should display non-selected remaining options on the list", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll(".menu-option").length).toBe(options.length - 1);
  });

  it("should remove a selected option and be able to select it again", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll(".menu-option").length).toBe(options.length - 1);

    await wrapper.get(".multi-value-remove").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll(".menu-option").length).toBe(options.length);
    expect(wrapper.findAll(".multi-value").length).toBe(0);
  });
});

describe("search emit", () => {
  it("should emit the search event when typing in the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await inputSearch(wrapper, "United");

    expect(wrapper.emitted("search")).toStrictEqual([["United"]]);
  });

  it("should emit an empty string for the search when the menu is closed", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await inputSearch(wrapper, "United");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Escape" }));

    expect(wrapper.emitted("search")).toStrictEqual([["United"], [""]]);
  });
});

describe("custom option/value mapping", async () => {
  it("retrieve custom option value with getOptionValue prop", async () => {
    const options = [
      { id: "Admin", key: "admin" },
      { id: "User", key: "user" },
    ];

    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options: options as unknown as Option<string>[],
        getOptionValue: (option: any) => option.key,
      },
    });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([["admin"]]);
  });

  it("retrieve custom option label with getOptionLabel prop", async () => {
    const options = [
      { id: "Admin", key: "admin" },
      { id: "User", key: "user" },
    ];

    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options: options as unknown as Option<string>[],
        getOptionLabel: (option: any) => option.id,
      },
    });

    await openMenu(wrapper);

    const optionElements = wrapper.findAll("div[role='option']");
    expect(optionElements[0].text()).toBe("Admin");
    expect(optionElements[1].text()).toBe("User");

    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.get(".single-value").text()).toBe("Admin");
  });
});

describe("misc props", () => {
  it("should disable the input when passing the isDisabled prop", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isDisabled: true } });

    expect(wrapper.get("input").attributes("disabled")).toBe("");
  });

  it("should not filter menu options when isSearchable prop is set to false", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isSearchable: false } });

    await openMenu(wrapper);
    await inputSearch(wrapper, "United");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should not autofocus an option when passing the autofocus prop", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, shouldAutofocusOption: false } });

    await openMenu(wrapper);

    expect(wrapper.findAll(".focused[role='option']")).toHaveLength(0);
  });
});
