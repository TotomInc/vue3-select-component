import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { DATA_KEY } from "./lib/provide-inject";
import MenuOption from "./MenuOption.vue";

const createMockProvide = (overrides = {}) => ({
  setFocusedOption: vi.fn(),
  focusedOption: ref(-1),
  menuOpen: ref(true),
  ...overrides,
});

const defaultGlobal = {
  provide: { [DATA_KEY as symbol]: createMockProvide() },
};

describe("scrolling behavior", () => {
  it.each([
    { name: "above viewport", scrollTop: 100, optionTop: 50, optionHeight: 40, clientHeight: 200, expectedScroll: 50 },
    { name: "below viewport", scrollTop: 50, optionTop: 300, optionHeight: 40, clientHeight: 200, expectedScroll: 140 },
  ])("should scroll to focused option when $name", async ({ scrollTop, optionTop, optionHeight, clientHeight, expectedScroll }) => {
    const mockMenu = {
      scrollTop,
      clientHeight,
      children: [{ offsetTop: optionTop, clientHeight: optionHeight }] as HTMLDivElement[],
    } as unknown as HTMLDivElement;

    const wrapper = mount(MenuOption, {
      props: { menu: mockMenu, index: 0, isFocused: false, isSelected: false, isDisabled: false },
      global: defaultGlobal,
    });

    await wrapper.setProps({ isFocused: true });
    expect(mockMenu.scrollTop).toBe(expectedScroll);
  });

  it("should not scroll when option is already visible", async () => {
    const mockMenu = {
      scrollTop: 100,
      clientHeight: 200,
      children: [{ offsetTop: 150, clientHeight: 40 }] as HTMLDivElement[],
    } as unknown as HTMLDivElement;

    const wrapper = mount(MenuOption, {
      props: { menu: mockMenu, index: 0, isFocused: false, isSelected: false, isDisabled: false },
      global: defaultGlobal,
    });

    const initialScrollTop = mockMenu.scrollTop;
    await wrapper.setProps({ isFocused: true });
    expect(mockMenu.scrollTop).toBe(initialScrollTop);
  });
});

describe("selection events", () => {
  it.each([
    { trigger: "keydown.enter", name: "Enter key" },
    { trigger: "click", name: "click" },
  ])("should emit select event on $name", async ({ trigger }) => {
    const wrapper = mount(MenuOption, {
      props: { menu: null, index: 0, isFocused: true, isSelected: false, isDisabled: false },
      global: defaultGlobal,
    });

    await wrapper.trigger(trigger);
    expect(wrapper.emitted("select")).toHaveLength(1);
  });

  it("should still emit select when disabled (handled by parent)", async () => {
    const wrapper = mount(MenuOption, {
      props: { menu: null, index: 0, isFocused: true, isSelected: false, isDisabled: true },
      global: defaultGlobal,
    });

    await wrapper.trigger("click");
    await wrapper.trigger("keydown.enter");

    expect(wrapper.emitted("select")).toHaveLength(2);
  });
});

describe("hover to focus behavior", () => {
  it("should set focused option when hovered", async () => {
    const mockSetFocusedOption = vi.fn();
    const mockData = {
      setFocusedOption: mockSetFocusedOption,
      focusedOption: ref(-1),
      menuOpen: ref(true),
    };

    const wrapper = mount(MenuOption, {
      props: {
        menu: null,
        index: 2,
        isFocused: false,
        isSelected: false,
        isDisabled: false,
      },
      global: {
        provide: {
          [DATA_KEY as symbol]: mockData,
        },
      },
    });

    // Trigger mouse enter
    await wrapper.trigger("mouseenter");

    // Verify setFocusedOption was called with the correct index
    expect(mockSetFocusedOption).toHaveBeenCalledWith(2);
    expect(mockSetFocusedOption).toHaveBeenCalledTimes(1);
  });

  it("should not set focused option when hovered on disabled option", async () => {
    const mockSetFocusedOption = vi.fn();
    const mockData = {
      setFocusedOption: mockSetFocusedOption,
      focusedOption: ref(-1),
      menuOpen: ref(true),
    };

    const wrapper = mount(MenuOption, {
      props: {
        menu: null,
        index: 2,
        isFocused: false,
        isSelected: false,
        isDisabled: true, // Option is disabled
      },
      global: {
        provide: {
          [DATA_KEY as symbol]: mockData,
        },
      },
    });

    // Trigger mouse enter
    await wrapper.trigger("mouseenter");

    // Verify setFocusedOption was NOT called
    expect(mockSetFocusedOption).not.toHaveBeenCalled();
  });
});
