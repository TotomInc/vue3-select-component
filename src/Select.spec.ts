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
    await wrapper.get("input").trigger("keydown.space");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should close the menu after focusing and pressing tab", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");
    await wrapper.get("input").trigger("keydown.tab");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });
});
