import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { expect, it } from "vitest";

import VueSelect from "./Select.vue";
import type { Option } from "./types";

const options: Option[] = [
  { label: "France", value: "FR" },
  { label: "Germany", value: "DE" },
  { label: "Italy", value: "IT" },
  { label: "Spain", value: "ES" },
  { label: "United Kingdom", value: "UK" },
  { label: "United States", value: "US" },
];

it("should render the select component", () => {
  const wrapper = mount(
    VueSelect,
    { props: { modelValue: "", options } },
  );

  expect(wrapper.find("[role=combobox]").exists()).toBe(true);
});

it("should display the options when clicking on the select", async () => {
  const wrapper = mount(
    VueSelect,
    { props: { modelValue: "", options } },
  );

  wrapper.find("input").trigger("mousedown");
  await nextTick();

  expect(wrapper.find("[role=listbox]").exists()).toBe(true);
  expect(wrapper.findAll("[role=option]").length).toBe(options.length);
});

it("should select an option when clicking on it", async () => {
  const wrapper = mount(
    VueSelect,
    { props: { modelValue: "", options } },
  );

  wrapper.find("input").trigger("mousedown");
  await nextTick();

  wrapper.findAll("[role=option]")[0].trigger("click");
  await nextTick();

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([options[0].value]);
});
