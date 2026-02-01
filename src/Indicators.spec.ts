import type { ComponentProps } from "vue-component-type-helpers";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ChevronDownIcon from "./icons/ChevronDownIcon.vue";
import XMarkIcon from "./icons/XMarkIcon.vue";
import Select from "./Select.vue";
import Spinner from "./Spinner.vue";

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

async function selectFirstOption(wrapper: ReturnType<typeof mount>) {
  await wrapper.get("input").trigger("mousedown");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
  await wrapper.vm.$nextTick();
}

describe("indicators rendering", () => {
  it("should render default icons", () => {
    const wrapper = mount(Select, { props: defaultProps });

    expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(true);
    expect(wrapper.findComponent(XMarkIcon).exists()).toBe(false);
    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
  });

  it.each([
    { isLoading: false, hasDropdown: true, hasSpinner: false },
    { isLoading: true, hasDropdown: false, hasSpinner: true },
  ])("loading=$isLoading: dropdown=$hasDropdown, spinner=$hasSpinner", ({ isLoading, hasDropdown, hasSpinner }) => {
    const wrapper = mount(Select, { props: { ...defaultProps, isLoading } });

    expect(wrapper.find(".dropdown-icon").exists()).toBe(hasDropdown);
    expect(wrapper.findComponent(Spinner).exists()).toBe(hasSpinner);
  });
});

describe("dropdown button", () => {
  it("should have active class when menu is open", async () => {
    const wrapper = mount(Select, { props: defaultProps });

    await wrapper.get("input").trigger("mousedown");
    expect(wrapper.find(".dropdown-icon").classes()).toContain("active");
  });

  it("should be disabled when component is disabled", () => {
    const wrapper = mount(Select, { props: { ...defaultProps, isDisabled: true } });

    expect(wrapper.find(".dropdown-icon").attributes("disabled")).toBe("");
  });

  it("should emit toggle event when clicked", async () => {
    const wrapper = mount(Select, { props: defaultProps });
    const indicators = wrapper.getComponent({ name: "Indicators" });

    await wrapper.find(".dropdown-icon").trigger("click");
    expect(indicators.emitted("toggle")).toStrictEqual([[]]);
  });
});

describe("clear button", () => {
  it.each([
    { hasSelection: true, isClearable: true, isLoading: false, shouldExist: true },
    { hasSelection: false, isClearable: true, isLoading: false, shouldExist: false },
    { hasSelection: true, isClearable: false, isLoading: false, shouldExist: false },
    { hasSelection: true, isClearable: true, isLoading: true, shouldExist: false },
  ])("selection=$hasSelection, clearable=$isClearable, loading=$isLoading -> exists=$shouldExist", async ({ hasSelection, isClearable, isLoading, shouldExist }) => {
    const wrapper = mount(Select, { props: { ...defaultProps, isClearable, isLoading } });

    if (hasSelection) {
      await selectFirstOption(wrapper);
    }

    expect(wrapper.find(".clear-button").exists()).toBe(shouldExist);
  });

  it("should emit clear event when clicked", async () => {
    const wrapper = mount(Select, { props: defaultProps });
    const indicators = wrapper.getComponent({ name: "Indicators" });

    await selectFirstOption(wrapper);
    await wrapper.find(".clear-button").trigger("click");

    expect(indicators.emitted("clear")).toHaveLength(1);
  });
});

describe("custom slots", () => {
  it.each([
    { slot: "clear", slotContent: "<span class=\"custom-clear\">x</span>", selector: ".custom-clear", hiddenComponent: XMarkIcon, requiresSelection: true },
    { slot: "dropdown", slotContent: "<span class=\"custom-dropdown\">v</span>", selector: ".custom-dropdown", hiddenComponent: ChevronDownIcon, requiresSelection: false },
    { slot: "loading", slotContent: "<div class=\"custom-loader\">...</div>", selector: ".custom-loader", hiddenComponent: Spinner, requiresSelection: false, extraProps: { isLoading: true } },
  ])("should render custom $slot slot", async ({ slot, slotContent, selector, hiddenComponent, requiresSelection, extraProps }) => {
    const wrapper = mount(Select, {
      props: { ...defaultProps, ...extraProps },
      slots: { [slot]: slotContent },
    });

    if (requiresSelection) {
      await selectFirstOption(wrapper);
    }

    expect(wrapper.find(selector).exists()).toBe(true);
    expect(wrapper.findComponent(hiddenComponent).exists()).toBe(false);
  });
});
