import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MenuOption from "../src/MenuOption.vue";

describe("scrolling behavior when option is above viewport", () => {
  it("should scroll the menu to show the focused option when it's above the viewport", async () => {
    const mockMenu = {
      scrollTop: 100, // Simulate menu scrolled down
      clientHeight: 200,
      children: [
        { offsetTop: 50, clientHeight: 40 }, // Option is above visible area (offsetTop < scrollTop)
      ] as HTMLDivElement[],
    } as unknown as HTMLDivElement;

    const wrapper = mount(MenuOption, {
      props: {
        menu: mockMenu,
        index: 0,
        isFocused: false,
        isSelected: false,
        isDisabled: false,
      },
    });

    // Initial state - menu scroll position hasn't changed
    expect(mockMenu.scrollTop).toBe(100);

    // Update props to set focus to true
    await wrapper.setProps({ isFocused: true });

    // Verify menu was scrolled to show the option
    expect(mockMenu.scrollTop).toBe(50); // Should match the offsetTop of the option
  });
});

describe("scrolling behavior when option is below viewport", () => {
  it("should scroll the menu to show the focused option when it's below the viewport", async () => {
    const mockMenu = {
      scrollTop: 50,
      clientHeight: 200, // Viewport height
      children: [
        { offsetTop: 300, clientHeight: 40 }, // Option is below visible area (offsetTop + clientHeight > scrollTop + clientHeight)
      ] as HTMLDivElement[],
    } as unknown as HTMLDivElement;

    // Mount the component with the menu and set up props
    const wrapper = mount(MenuOption, {
      props: {
        menu: mockMenu,
        index: 0,
        isFocused: false,
        isSelected: false,
        isDisabled: false,
      },
    });

    // Initial state - menu scroll position hasn't changed
    expect(mockMenu.scrollTop).toBe(50);

    // Update props to set focus to true
    await wrapper.setProps({ isFocused: true });

    // Verify menu was scrolled to show the option
    // The formula is: scrollTop = optionBottom - menuHeight
    const expectedScrollTop = (300 + 40) - 200;
    expect(mockMenu.scrollTop).toBe(expectedScrollTop);
  });

  it("should not scroll the menu when the focused option is already visible", async () => {
    const mockMenu = {
      scrollTop: 100,
      clientHeight: 200,
      children: [
        { offsetTop: 150, clientHeight: 40 }, // Option is within visible area
      ] as HTMLDivElement[],
    } as unknown as HTMLDivElement;

    // Mount the component with the menu and set up props
    const wrapper = mount(MenuOption, {
      props: {
        menu: mockMenu,
        index: 0,
        isFocused: false,
        isSelected: false,
        isDisabled: false,
      },
    });

    // Initial state
    const initialScrollTop = mockMenu.scrollTop;

    // Update props to set focus to true
    await wrapper.setProps({ isFocused: true });

    // Verify menu scroll position didn't change
    expect(mockMenu.scrollTop).toBe(initialScrollTop);
  });
});

describe("keyboard event handling", () => {
  it("should emit 'select' event when Enter key is pressed", async () => {
    const wrapper = mount(MenuOption, {
      props: {
        menu: null,
        index: 0,
        isFocused: true,
        isSelected: false,
        isDisabled: false,
      },
    });

    // Simulate a keydown event with Enter key
    await wrapper.trigger("keydown.enter");

    // Verify the 'select' event was emitted
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")).toHaveLength(1);
  });

  it("should not emit 'select' event when disabled", async () => {
    const wrapper = mount(MenuOption, {
      props: {
        menu: null,
        index: 0,
        isFocused: true,
        isSelected: false,
        isDisabled: true,
      },
    });

    // Try to select the option via click
    await wrapper.trigger("click");

    // Verify the 'select' event was not emitted
    expect(wrapper.emitted("select")).toStrictEqual([[]]);

    // Try to select with keyboard
    await wrapper.trigger("keydown.enter");

    // Still should not emit
    expect(wrapper.emitted("select")).toStrictEqual([[], []]);
  });

  it("should emit 'select' event when clicked", async () => {
    const wrapper = mount(MenuOption, {
      props: {
        menu: null,
        index: 0,
        isFocused: false,
        isSelected: false,
        isDisabled: false,
      },
    });

    await wrapper.trigger("click");

    // Verify the 'select' event was emitted
    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")).toHaveLength(1);
  });
});
