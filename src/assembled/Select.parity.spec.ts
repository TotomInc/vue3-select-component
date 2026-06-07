import { describe, expect, it, vi } from "vitest";

import { mountAssembledSelect } from "../test-utils/mount-assembled-select";

const options = [
  { label: "France", value: "FR" },
  { label: "Spain", value: "ES", disabled: true },
  { label: "United Kingdom", value: "GB" },
];

describe("v1 assembled Select v0 parity", () => {
  it("shows the placeholder when no option is selected", () => {
    const { wrapper } = mountAssembledSelect({
      options,
      placeholder: "Select a country",
    });

    expect(wrapper.get("[data-select-value]").text()).toBe("Select a country");
  });

  it("does not open the menu when disabled", async () => {
    const { wrapper } = mountAssembledSelect({
      options,
      disabled: true,
    });

    const trigger = wrapper.get("[data-select-trigger]");

    expect(trigger.attributes("disabled")).toBeDefined();
    expect(trigger.attributes("aria-expanded")).toBe("false");

    await trigger.trigger("click");

    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");
  });

  it("cannot select a disabled option", async () => {
    const { wrapper, model } = mountAssembledSelect({
      options: [{ label: "Spain", value: "ES", disabled: true }],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option]").trigger("click");

    expect(model.value).toBeNull();
  });

  it("selects the active option with Enter", async () => {
    const { wrapper, model } = mountAssembledSelect({ options });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "Enter" });

    expect(model.value).toBe("FR");
    expect(wrapper.get("[data-select-value]").text()).toBe("France");
  });

  it("closes the menu on Escape", async () => {
    const { wrapper } = mountAssembledSelect({ options });

    await wrapper.get("[data-select-trigger]").trigger("click");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("false");

    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "Escape" });

    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");
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
    const { wrapper } = mountAssembledSelect({
      options,
      searchable: true,
      onSearch,
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-input]").setValue("United");

    expect(onSearch).toHaveBeenCalledWith("United");
    expect(wrapper.findAll("[data-select-option]")).toHaveLength(1);
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

  it("emits optionDeselected with null when clearing all multi values", async () => {
    const onOptionDeselected = vi.fn();
    const { wrapper } = mountAssembledSelect({
      options,
      multiple: true,
      clearable: true,
      modelValue: ["FR", "GB"],
      onOptionDeselected,
    });

    await wrapper.get("[data-select-clear]").trigger("click");

    expect(onOptionDeselected).toHaveBeenCalledWith(null);
  });

  it("removes the last selected value on Backspace in multi-select mode", async () => {
    const { wrapper, model } = mountAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR", "GB"],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "Backspace" });

    expect(model.value).toEqual(["FR"]);
  });

  it("shows the loading indicator when isLoading is enabled", () => {
    const { wrapper } = mountAssembledSelect({
      options,
      isLoading: true,
    });

    expect(wrapper.get("[data-select-indicator]").attributes("data-loading")).toBe("true");
  });
});
