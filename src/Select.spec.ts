import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import VueSelect from "./Select.vue";

const options = [
  { label: "France", value: "FR" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Germany", value: "DE" },
];

it("should render the component", () => {
  const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

  expect(wrapper.exists()).toBe(true);
});

describe("input + menu interactions behavior", () => {
  it("should display the placeholder in the input when no option is selected", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    expect(wrapper.find("input").attributes("placeholder"));
  });

  it ("should not open the menu when focusing the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("focus");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should open the menu when triggering mousedown on the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should open the menu when focusing the input and pressing space", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("focus");
    await wrapper.get("input").trigger("keydown", { key: "Space" });

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should close the menu after focusing and pressing tab", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("input").trigger("keydown", { key: "Tab" });

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should close the menu when clicking outside the menu", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    document.dispatchEvent(new MouseEvent("click"));
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should close the menu when hitting escape", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });
});

describe("menu keyboard navigation", () => {
  it("should navigate through the options with the arrow keys", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    await wrapper.vm.$nextTick();

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[1].label);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    await wrapper.vm.$nextTick();

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0].label);
  });
});

describe("menu filtering", () => {
  it("should filter the options when typing in the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("input").setValue("United");

    expect(wrapper.findAll("div[role='option']").length).toBe(2);

    await wrapper.get("input").setValue("United States");

    expect(wrapper.findAll("div[role='option']").length).toBe(1);
  });
});

describe("single-select option", () => {
  it("should select an option when clicking on it", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("should select an option when focusing and pressing enter", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("focus");
    await wrapper.get("input").trigger("keydown", { key: "Space" });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("should remove the selected option when pressing backspace without typing", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);

    await wrapper.get("input").trigger("mousedown");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value], [undefined]]);
    expect(wrapper.find(".single-value").exists()).toBe(false);
  });

  it("should not remove the selected option when pressing backspace after typing", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);

    await wrapper.get("input").setValue("F");
    await wrapper.get("input").trigger("keydown", { key: "Backspace" });

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("cannot select an option when there are no matching options", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("input").setValue("Foo");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});

describe("clear button", () => {
  it("should display the clear button when an option is selected", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isClearable: true } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.find(".clear-button").exists()).toBe(true);
  });

  it("should clear the selected option when clicking on the clear button", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isClearable: true } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("div[role='option']").trigger("click");
    await wrapper.get(".clear-button").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value], [undefined]]);
    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });
});

describe("component props", () => {
  it("should display the placeholder in the input when no option is selected", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, placeholder: "Pick an option" } });

    expect(wrapper.find("input").attributes("placeholder")).toBe("Pick an option");
  });

  it("should disable the input when passing the isDisabled prop", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isDisabled: true } });

    expect(wrapper.get("input").attributes("disabled")).toBe("");
  });

  it("should not filter menu options when isSearchable prop is set to false", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isSearchable: false } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("input").setValue("United");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });
});
