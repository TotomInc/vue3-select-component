import { afterEach, describe, expect, it, vi } from "vitest";

import SelectListbox from "../primitives/SelectListbox.vue";
import { cleanupTeleportedSelectContent } from "../test-utils/assembled-select-helpers";
import { mountAssembledSelect } from "../test-utils/mount-assembled-select";

const options = [
  { label: "France", value: "FR" },
  { label: "Spain", value: "ES", disabled: true },
  { label: "United Kingdom", value: "GB" },
];

describe("assembled Select", () => {
  afterEach(() => {
    cleanupTeleportedSelectContent();
  });

  it("shows the placeholder when no option is selected", () => {
    const { wrapper } = mountAssembledSelect({
      options,
      placeholder: "Select a country",
    });

    expect(wrapper.get("[data-select-value]").text()).toBe("Select a country");
  });

  it("teleports the menu to body by default", async () => {
    const { wrapper, getTeleportedPopoverElement, getPopoverAriaHidden } = mountAssembledSelect({
      options,
    });

    expect(wrapper.find("[data-select-popover]").exists()).toBe(false);

    await wrapper.get("[data-select-trigger]").trigger("click");

    const teleportedPopover = getTeleportedPopoverElement();

    expect(teleportedPopover).not.toBeNull();
    expect(getPopoverAriaHidden()).toBe("false");
    expect(wrapper.getComponent(SelectListbox).attributes("role")).toBe("listbox");
  });

  it("selects an option with click and closes the menu", async () => {
    const { wrapper, model, findOptions, getPopoverAriaHidden } = mountAssembledSelect({
      options,
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await findOptions()[0]!.trigger("click");

    expect(model.value).toBe("FR");
    expect(wrapper.get("[data-select-value]").text()).toBe("France");
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("does not open the menu when disabled", async () => {
    const { wrapper, getPopoverAriaHidden } = mountAssembledSelect({
      options,
      disabled: true,
    });

    const trigger = wrapper.get("[data-select-trigger]");

    expect(trigger.attributes("disabled")).toBeDefined();
    expect(trigger.attributes("aria-expanded")).toBe("false");

    await trigger.trigger("click");

    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("cannot select a disabled option", async () => {
    const { wrapper, model, findOptions } = mountAssembledSelect({
      options: [{ label: "Spain", value: "ES", disabled: true }],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await findOptions()[0]!.trigger("click");

    expect(model.value).toBeNull();
  });

  it("selects the active option with Enter", async () => {
    const { wrapper, model, getListbox } = mountAssembledSelect({ options });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await getListbox().trigger("keydown", { key: "Enter" });

    expect(model.value).toBe("FR");
    expect(wrapper.get("[data-select-value]").text()).toBe("France");
  });

  it("closes the menu on Escape", async () => {
    const { wrapper, getListbox, getPopoverAriaHidden } = mountAssembledSelect({ options });

    await wrapper.get("[data-select-trigger]").trigger("click");
    expect(getPopoverAriaHidden()).toBe("false");

    await getListbox().trigger("keydown", { key: "Escape" });

    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("does not render the clear button when clearable is disabled", () => {
    const { wrapper } = mountAssembledSelect({
      options,
      modelValue: "FR",
    });

    expect(wrapper.find("[data-select-clear]").exists()).toBe(false);
  });

  it("renders custom clear button content from the clear slot", () => {
    const { wrapper } = mountAssembledSelect({
      options,
      clearable: true,
      modelValue: "FR",
      slots: {
        clear: () => "Reset",
      },
    });

    expect(wrapper.get("[data-select-clear]").text()).toBe("Reset");
    expect(wrapper.find("[data-select-clear] svg").exists()).toBe(false);
  });

  it("clears the selected option from the clear button", async () => {
    const { wrapper, model } = mountAssembledSelect({
      options,
      clearable: true,
      modelValue: "FR",
    });

    await wrapper.get("[data-select-clear]").trigger("click");

    expect(model.value).toBeNull();
    expect(wrapper.get("[data-select-value]").text()).toBe("Pick a language");
  });

  it("emits search when typing in searchable mode", async () => {
    const onSearch = vi.fn();
    const { wrapper, getInput, findVisibleOptions } = mountAssembledSelect({
      options,
      searchable: true,
      onSearch,
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await getInput().get("input").setValue("United");

    expect(onSearch).toHaveBeenCalledWith("United");
    expect(findVisibleOptions()).toHaveLength(1);
  });

  it("emits optionDeselected when clearing a single selection", async () => {
    const onOptionDeselected = vi.fn();
    const { wrapper } = mountAssembledSelect({
      options,
      clearable: true,
      modelValue: "FR",
      onOptionDeselected,
    });

    await wrapper.get("[data-select-clear]").trigger("click");

    expect(onOptionDeselected).toHaveBeenCalledWith({ label: "France", value: "FR" });
  });

  it("removes the last selected value on Backspace in multi-select mode", async () => {
    const { wrapper, model, getListbox } = mountAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR", "GB"],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await getListbox().trigger("keydown", { key: "Backspace" });

    expect(model.value).toEqual(["FR"]);
  });

  it("closes the menu after multi-select when closeOnSelect is true", async () => {
    const { wrapper, model, findOptions, getPopoverAriaHidden } = mountAssembledSelect({
      options: [
        { label: "JavaScript", value: "js" },
        { label: "TypeScript", value: "ts" },
      ],
      multiple: true,
      closeOnSelect: true,
      modelValue: [],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await findOptions()[0]!.trigger("click");

    expect(model.value).toEqual(["js"]);
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("keeps the menu open on multi-select when closeOnSelect is false", async () => {
    const { wrapper, model, findOptions, getPopoverAriaHidden } = mountAssembledSelect({
      options: [
        { label: "JavaScript", value: "js" },
        { label: "TypeScript", value: "ts" },
      ],
      multiple: true,
      closeOnSelect: false,
      modelValue: [],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await findOptions()[0]!.trigger("click");

    expect(model.value).toEqual(["js"]);
    expect(getPopoverAriaHidden()).toBe("false");
  });

  it("shows the loading indicator when loading is enabled", () => {
    const { wrapper } = mountAssembledSelect({
      options,
      loading: true,
    });

    expect(wrapper.get("[data-select-indicator]").attributes("data-loading")).toBe("true");
  });

  it("shows a checkmark on selected options in multi-select mode", async () => {
    const { wrapper, findRenderedOptionElements } = mountAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR"],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");

    const selectedOption = findRenderedOptionElements().find(
      (option) => option.dataset.value === "FR",
    );
    const unselectedOption = findRenderedOptionElements().find(
      (option) => option.dataset.value === "GB",
    );

    expect(selectedOption?.querySelector("[data-select-option-checkmark] svg")).not.toBeNull();
    expect(unselectedOption?.querySelector("[data-select-option-checkmark]")).toBeNull();
  });

  it("hides selected options from the dropdown when hideSelected is enabled", async () => {
    const { wrapper, findRenderedOptionElements } = mountAssembledSelect({
      options,
      multiple: true,
      hideSelected: true,
      modelValue: ["FR"],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");

    const visibleValues = findRenderedOptionElements().map((option) => option.dataset.value);

    expect(visibleValues).not.toContain("FR");
    expect(visibleValues).toContain("GB");
  });

  it("keeps selected options visible in the dropdown by default", async () => {
    const { wrapper, findRenderedOptionElements } = mountAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR"],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");

    const visibleValues = findRenderedOptionElements().map((option) => option.dataset.value);

    expect(visibleValues).toContain("FR");
    expect(visibleValues).toContain("GB");
  });

  it("renders a custom empty state from the no-options slot when filtering has no results", async () => {
    const { wrapper, getInput, getTeleportedPopoverElement } = mountAssembledSelect({
      options,
      searchable: true,
      slots: {
        "no-options": ({ searchValue }: { searchValue: string }) => `Nothing for "${searchValue}"`,
      },
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await getInput().get("input").setValue("zzzz");

    const noOptions = getTeleportedPopoverElement()?.querySelector("[data-select-no-options]");

    expect(noOptions?.textContent).toBe("Nothing for \"zzzz\"");
  });

  it("renders a custom tag remove icon from the tag-remove slot", () => {
    const { wrapper } = mountAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR", "GB"],
      slots: {
        "tag-remove": () => "×",
      },
    });

    const removeButtons = wrapper.findAll("[data-select-tag-remove]");

    expect(removeButtons).toHaveLength(2);
    expect(removeButtons.every((button) => button.text() === "×")).toBe(true);
    expect(wrapper.find("[data-select-tag-remove] svg").exists()).toBe(false);
  });

  it("forwards popover props to SelectPopover", () => {
    const { getPopoverComponent } = mountAssembledSelect({
      options,
      teleport: false,
      side: "top",
      align: "end",
      sideOffset: 10,
      modal: true,
    });

    const popover = getPopoverComponent();

    expect(popover.props("side")).toBe("top");
    expect(popover.props("align")).toBe("end");
    expect(popover.props("sideOffset")).toBe(10);
    expect(popover.props("modal")).toBe(true);
  });
});
