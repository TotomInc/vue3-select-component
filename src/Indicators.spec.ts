import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ChevronDownIcon from "./icons/ChevronDownIcon.vue";
import XMarkIcon from "./icons/XMarkIcon.vue";
import Indicators from "./Indicators.vue";
import Spinner from "./Spinner.vue";

const defaultProps = {
  hasSelectedOption: false,
  isMenuOpen: false,
  isClearable: true,
  isLoading: false,
  isDisabled: false,
};

describe("component setup and initialization", () => {
  it("should render with default imports", () => {
    const wrapper = mount(Indicators, {
      props: defaultProps,
    });

    expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(true);
    expect(wrapper.findComponent(XMarkIcon).exists()).toBe(false);
    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
  });
});

describe("dropdown button rendering", () => {
  it("should render dropdown button when not loading", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        isLoading: false,
      },
    });

    expect(wrapper.find(".dropdown-icon").exists()).toBe(true);
  });

  it("should not render dropdown button when loading", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        isLoading: true,
      },
    });

    expect(wrapper.find(".dropdown-icon").exists()).toBe(false);
  });

  it("should add active class to dropdown button when menu is open", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        isMenuOpen: true,
      },
    });

    expect(wrapper.find(".dropdown-icon").classes()).toContain("active");
  });

  it("should disable dropdown button when component is disabled", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        isDisabled: true,
      },
    });

    expect(wrapper.find(".dropdown-icon").attributes("disabled")).toBe("");
  });

  it("should emit toggle event when dropdown button is clicked", async () => {
    const wrapper = mount(Indicators, {
      props: defaultProps,
    });

    await wrapper.find(".dropdown-icon").trigger("click");
    expect(wrapper.emitted("toggle")).toBeTruthy();
    expect(wrapper.emitted("toggle")!.length).toBe(1);
  });
});

describe("loading state handling", () => {
  it("should render spinner when loading", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        isLoading: true,
      },
    });

    expect(wrapper.findComponent(Spinner).exists()).toBe(true);
  });

  it("should not render spinner when not loading", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        isLoading: false,
      },
    });

    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
  });

  it("should use custom loading slot content when provided", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        isLoading: true,
      },
      slots: {
        loading: "<div class=\"custom-loader\">Loading...</div>",
      },
    });

    expect(wrapper.find(".custom-loader").exists()).toBe(true);
    expect(wrapper.findComponent(Spinner).exists()).toBe(false);
  });
});

describe("clear button behavior", () => {
  it("should render clear button when there is a selected option and isClearable is true", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        hasSelectedOption: true,
        isClearable: true,
      },
    });

    expect(wrapper.find(".clear-button").exists()).toBe(true);
  });

  it("should not render clear button when there is no selected option", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        hasSelectedOption: false,
        isClearable: true,
      },
    });

    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });

  it("should not render clear button when isClearable is false", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        hasSelectedOption: true,
        isClearable: false,
      },
    });

    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });

  it("should not render clear button when loading", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        hasSelectedOption: true,
        isClearable: true,
        isLoading: true,
      },
    });

    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });

  it("should emit clear event when clear button is clicked", async () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        hasSelectedOption: true,
      },
    });

    await wrapper.find(".clear-button").trigger("click");
    expect(wrapper.emitted("clear")).toBeTruthy();
    expect(wrapper.emitted("clear")!.length).toBe(1);
  });

  it("should not be clickable when disabled", async () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        hasSelectedOption: true,
        isDisabled: true,
      },
    });

    const clearButton = wrapper.find(".clear-button");
    expect(clearButton.attributes("disabled")).toBe("");
  });
});

describe("custom slots", () => {
  it("should use custom clear button slot content when provided", () => {
    const wrapper = mount(Indicators, {
      props: {
        ...defaultProps,
        hasSelectedOption: true,
      },
      slots: {
        clear: "<span class=\"custom-clear\">✕</span>",
      },
    });

    expect(wrapper.find(".custom-clear").exists()).toBe(true);
    expect(wrapper.findComponent(XMarkIcon).exists()).toBe(false);
  });

  it("should use custom dropdown slot content when provided", () => {
    const wrapper = mount(Indicators, {
      props: defaultProps,
      slots: {
        dropdown: "<span class=\"custom-dropdown\">▼</span>",
      },
    });

    expect(wrapper.find(".custom-dropdown").exists()).toBe(true);
    expect(wrapper.findComponent(ChevronDownIcon).exists()).toBe(false);
  });
});
