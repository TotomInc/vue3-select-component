import type { ComponentProps } from "vue-component-type-helpers";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ChevronDownIcon from "../src/icons/ChevronDownIcon.vue";
import XMarkIcon from "../src/icons/XMarkIcon.vue";
import Select from "../src/Select.vue";
import Spinner from "../src/Spinner.vue";
import { dispatchEvent } from "./utils";

const options = [
  { label: "France", value: "FR" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Germany", value: "DE" },
];

const defaultProps: ComponentProps<typeof Select> = {
  options,
  modelValue: null,
  isClearable: true,
  isLoading: false,
  isDisabled: false,
};

describe("component setup and initialization", () => {
  it("should render with default imports", () => {
    const wrapper = mount(Select, { props: defaultProps });

    expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(true);
    expect(wrapper.findComponent(XMarkIcon).exists()).toBe(false);
    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
  });
});

describe("dropdown button rendering", () => {
  it("should render dropdown button when not loading", () => {
    const wrapper = mount(Select, { props: { ...defaultProps, isLoading: false } });

    expect(wrapper.find(".dropdown-icon").exists()).toBe(true);
  });

  it("should not render dropdown button when loading", () => {
    const wrapper = mount(Select, { props: { ...defaultProps, isLoading: true } });

    expect(wrapper.find(".dropdown-icon").exists()).toBe(false);
  });

  it("should add active class to dropdown button when menu is open", async () => {
    const wrapper = mount(Select, { props: { ...defaultProps } });

    await wrapper.get("input").trigger("mousedown");
    expect(wrapper.find(".dropdown-icon").classes()).toContain("active");
  });

  it("should disable dropdown button when component is disabled", () => {
    const wrapper = mount(Select, { props: { ...defaultProps, isDisabled: true } });

    expect(wrapper.find(".dropdown-icon").attributes("disabled")).toBe("");
  });

  it("should emit toggle event when dropdown button is clicked", async () => {
    const wrapper = mount(Select, { props: defaultProps });
    const indicators = wrapper.getComponent({ name: "Indicators" });

    await wrapper.find(".dropdown-icon").trigger("click");
    expect(indicators.emitted("toggle")).toStrictEqual([[]]);
  });
});

describe("loading state handling", () => {
  it("should render spinner when loading", () => {
    const wrapper = mount(Select, { props: { ...defaultProps, isLoading: true } });

    expect(wrapper.findComponent(Spinner).exists()).toBe(true);
  });

  it("should not render spinner when not loading", () => {
    const wrapper = mount(Select, { props: { ...defaultProps, isLoading: false } });

    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
  });

  it("should use custom loading slot content when provided", () => {
    const wrapper = mount(Select, {
      props: { ...defaultProps, isLoading: true },
      slots: { loading: "<div class=\"custom-loader\">Loading...</div>" },
    });

    expect(wrapper.find(".custom-loader").exists()).toBe(true);
    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
  });
});

describe("clear button behavior", () => {
  it("should render clear button when there is a selected option and isClearable is true", async () => {
    const wrapper = mount(Select, { props: { ...defaultProps } });

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.find(".clear-button").exists()).toBe(true);
  });

  it("should not render clear button when there is no selected option", () => {
    const wrapper = mount(Select, {
      props: { ...defaultProps, isClearable: true },
    });

    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });

  it("should not render clear button when isClearable is false", async () => {
    const wrapper = mount(Select, {
      props: { ...defaultProps, isClearable: false },
    });

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });

  it("should not render clear button when loading", async () => {
    const wrapper = mount(Select, {
      props: { ...defaultProps, isClearable: true, isLoading: true },
    });

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });

  it("should emit clear event when clear button is clicked", async () => {
    const wrapper = mount(Select, { props: defaultProps });
    const indicators = wrapper.getComponent({ name: "Indicators" });

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));
    await wrapper.find(".clear-button").trigger("click");

    expect(indicators.emitted("clear")).toBeTruthy();
    expect(indicators.emitted("clear")!.length).toBe(1);
  });
});

describe("custom slots", () => {
  it("should use custom clear button slot content when provided", async () => {
    const wrapper = mount(Select, {
      props: { ...defaultProps },
      slots: {
        clear: "<span class=\"custom-clear\">✕</span>",
      },
    });

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.find(".custom-clear").exists()).toBe(true);
    expect(wrapper.findComponent(XMarkIcon).exists()).toBe(false);
  });

  it("should use custom dropdown slot content when provided", async () => {
    const wrapper = mount(Select, {
      props: defaultProps,
      slots: {
        dropdown: "<span class=\"custom-dropdown\">▼</span>",
      },
    });

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.find(".custom-dropdown").exists()).toBe(true);
    expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(false);
  });
});
