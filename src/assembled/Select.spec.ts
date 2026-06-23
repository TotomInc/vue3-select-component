import { afterEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import {
  cleanupTeleportedSelectContent,
  dispatchKeydown,
  flushFocusUpdates,
  locateInContainer,
  locateInDocument,
} from "../test-utils/browser-select-helpers";
import { renderAssembledSelect } from "../test-utils/render-assembled-select";

const options = [
  { label: "France", value: "FR" },
  { label: "Spain", value: "ES", disabled: true },
  { label: "United Kingdom", value: "GB" },
];

describe("assembled Select", () => {
  afterEach(() => {
    cleanupTeleportedSelectContent();
  });

  it("shows the placeholder when no option is selected", async () => {
    const { getValue } = await renderAssembledSelect({
      options,
      placeholder: "Select a country",
    });

    await expect.element(getValue()).toHaveTextContent("Select a country");
  });

  it("renders trigger search by default", async () => {
    const { getInput, openMenu } = await renderAssembledSelect({ options });

    await expect.element(getInput()).toHaveAttribute("role", "combobox");
    await expect.element(getInput()).toHaveAttribute("aria-haspopup", "listbox");

    await openMenu();

    const input = getInput().element();
    const listbox = locateInDocument("[data-select-listbox]").element();

    expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    expect(listbox.getAttribute("aria-labelledby")).toBe(input.id);
    await expect.element(getInput()).toHaveAttribute("data-select-input");
  });

  it("forwards control labelling attributes to the searchable input", async () => {
    const { screen, getInput } = await renderAssembledSelect({
      options,
      attrs: {
        "id": "country-select",
        "aria-label": "Country",
      },
    });

    await expect.element(locateInContainer(screen.container, "[data-select-root]")).not.toHaveAttribute("id");
    await expect.element(getInput()).toHaveAttribute("id", "country-select");
    await expect.element(getInput()).toHaveAttribute("aria-label", "Country");
  });

  it("teleports the menu to body by default", async () => {
    const { screen, getTeleportedPopoverElement, getPopoverAriaHidden, openMenu } = await renderAssembledSelect({
      options,
    });

    expect(screen.container.querySelector("[data-select-popover]")).toBeNull();

    await openMenu();

    const teleportedPopover = getTeleportedPopoverElement();

    expect(teleportedPopover).not.toBeNull();
    expect(getPopoverAriaHidden()).toBe("false");
    await expect.element(locateInDocument("[data-select-listbox]")).toHaveAttribute("role", "listbox");
  });

  it("selects an option with click and closes the menu", async () => {
    const { model, getValue, getPopoverAriaHidden, openMenu } = await renderAssembledSelect({
      options,
    });

    await openMenu();
    await page.getByRole("option", { name: "France" }).click();

    expect(model.value).toBe("FR");
    await expect.element(getValue()).toHaveTextContent("France");
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("does not open the menu when disabled", async () => {
    const { getTrigger, getInput, getPopoverAriaHidden } = await renderAssembledSelect({
      options,
      disabled: true,
    });

    await expect.element(getTrigger()).toHaveAttribute("aria-disabled", "true");
    await expect.element(getInput()).toHaveAttribute("disabled");
    await expect.element(getInput()).toHaveAttribute("aria-expanded", "false");

    await getTrigger().click();

    await expect.element(getInput()).toHaveAttribute("aria-expanded", "false");
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("cannot select a disabled option", async () => {
    const { model, openMenu } = await renderAssembledSelect({
      options: [{ label: "Spain", value: "ES", disabled: true }],
    });

    await openMenu();
    const option = page.getByRole("option", { name: "Spain" });

    await expect.element(option).toHaveAttribute("aria-disabled", "true");
    option.element().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(model.value).toBeNull();
  });

  it("selects the active option with Enter", async () => {
    const { model, getValue, getListbox, openMenu } = await renderAssembledSelect({ options });

    await openMenu();
    await dispatchKeydown(getListbox(), "Enter");

    expect(model.value).toBe("FR");
    await expect.element(getValue()).toHaveTextContent("France");
  });

  it("closes the menu when Tab moves focus outside a non-searchable trigger", async () => {
    const { getTrigger, getPopoverAriaHidden, openMenu } = await renderAssembledSelect({
      options,
      searchable: false,
    });
    const outside = document.createElement("button");

    document.body.append(outside);

    await openMenu();
    expect(getPopoverAriaHidden()).toBe("false");

    await dispatchKeydown(getTrigger(), "Tab");

    expect(getPopoverAriaHidden()).toBe("true");

    outside.remove();
  });

  it("closes the menu when focus moves outside a non-searchable select", async () => {
    const { getPopoverAriaHidden, openMenu } = await renderAssembledSelect({
      options,
      searchable: false,
    });
    const outside = document.createElement("button");

    document.body.append(outside);

    await openMenu();
    expect(getPopoverAriaHidden()).toBe("false");

    outside.focus();
    await flushFocusUpdates();

    expect(getPopoverAriaHidden()).toBe("true");

    outside.remove();
  });

  it("closes the menu on Escape", async () => {
    const { getListbox, getPopoverAriaHidden, openMenu } = await renderAssembledSelect({ options });

    await openMenu();
    expect(getPopoverAriaHidden()).toBe("false");

    await dispatchKeydown(getListbox(), "Escape");

    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("does not render the clear button when clearable is disabled", async () => {
    const { screen } = await renderAssembledSelect({
      options,
      modelValue: "FR",
    });

    expect(screen.container.querySelector("[data-select-clear]")).toBeNull();
  });

  it("renders custom clear button content from the clear slot", async () => {
    const { getClearButton } = await renderAssembledSelect({
      options,
      clearable: true,
      modelValue: "FR",
      slots: {
        clear: () => "Reset",
      },
    });

    await expect.element(getClearButton()).toHaveTextContent("Reset");
    expect(getClearButton().element().querySelector("svg")).toBeNull();
  });

  it("clears the selected option from the clear button", async () => {
    const { model, getValue, getClearButton } = await renderAssembledSelect({
      options,
      clearable: true,
      modelValue: "FR",
    });

    await getClearButton().click();

    expect(model.value).toBeNull();
    await expect.element(getValue()).toHaveTextContent("Pick a language");
  });

  it("focuses the first matching option while typing in the search input", async () => {
    const { getInput, openMenu } = await renderAssembledSelect({
      options: [
        { label: "Alpha", value: "alpha" },
        { label: "Beta", value: "beta" },
        { label: "Gamma", value: "gamma" },
      ],
    });

    await openMenu();
    const input = getInput();

    await dispatchKeydown(input, "ArrowDown");

    const getActiveOption = () => document.body.querySelector<HTMLElement>("[data-select-option][data-active='true']");

    expect(getActiveOption()?.dataset.value).toBe("beta");

    await getInput().fill("a");

    expect(getActiveOption()?.dataset.value).toBe("alpha");
    expect(input.element().getAttribute("aria-activedescendant")).toBe(getActiveOption()?.id);
  });

  it("emits search when typing in the trigger input", async () => {
    const onSearch = vi.fn();
    const { getInput, openMenu, findVisibleOptions } = await renderAssembledSelect({
      options,
      onSearch,
    });

    await openMenu();
    await getInput().fill("United");

    expect(onSearch).toHaveBeenCalledWith("United");
    expect(findVisibleOptions()).toHaveLength(1);
  });

  it("emits search when deleting the last letter", async () => {
    const onSearch = vi.fn();
    const { getInput, openMenu } = await renderAssembledSelect({
      options,
      onSearch,
    });

    await openMenu();
    const input = getInput();

    await input.fill("U");
    onSearch.mockClear();
    await input.fill("");

    expect(onSearch).toHaveBeenCalledWith("");
  });

  it("emits optionDeselected when clearing a single selection", async () => {
    const onOptionDeselected = vi.fn();
    const { getClearButton } = await renderAssembledSelect({
      options,
      clearable: true,
      modelValue: "FR",
      onOptionDeselected,
    });

    await getClearButton().click();

    expect(onOptionDeselected).toHaveBeenCalledWith({ label: "France", value: "FR" });
  });

  it("removes the last selected value on Backspace in multi-select mode", async () => {
    const { model, getListbox, openMenu } = await renderAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR", "GB"],
    });

    await openMenu();
    await dispatchKeydown(getListbox(), "Backspace");

    expect(model.value).toEqual(["FR"]);
  });

  it("closes the menu after multi-select when closeOnSelect is true", async () => {
    const { model, getPopoverAriaHidden, openMenu } = await renderAssembledSelect({
      options: [
        { label: "JavaScript", value: "js" },
        { label: "TypeScript", value: "ts" },
      ],
      multiple: true,
      closeOnSelect: true,
      modelValue: [],
    });

    await openMenu();
    await page.getByRole("option", { name: "JavaScript" }).click();

    expect(model.value).toEqual(["js"]);
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("keeps the menu open on multi-select when closeOnSelect is false", async () => {
    const { model, getPopoverAriaHidden, openMenu } = await renderAssembledSelect({
      options: [
        { label: "JavaScript", value: "js" },
        { label: "TypeScript", value: "ts" },
      ],
      multiple: true,
      closeOnSelect: false,
      modelValue: [],
    });

    await openMenu();
    await page.getByRole("option", { name: "JavaScript" }).click();

    expect(model.value).toEqual(["js"]);
    expect(getPopoverAriaHidden()).toBe("false");
  });

  it("shows the loading trailing icon when loading is enabled", async () => {
    const { screen } = await renderAssembledSelect({
      options,
      loading: true,
    });

    await expect.element(locateInContainer(screen.container, "[data-select-trailing-icon]")).toHaveAttribute("data-loading", "true");
  });

  it("renders a custom leading icon from the icon slot", async () => {
    const { screen } = await renderAssembledSelect({
      options,
      slots: {
        icon: () => "🌍",
      },
    });

    const icon = locateInContainer(screen.container, "[data-select-icon]");

    await expect.element(icon).toHaveTextContent("🌍");
    await expect.element(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a custom trailing icon from the trailing-icon slot", async () => {
    const { screen, getTrigger } = await renderAssembledSelect({
      options,
      slots: {
        "trailing-icon": ({ open }: { open: boolean }) => (open ? "▲" : "▼"),
      },
    });

    const trailingIconEl = screen.container.querySelector<HTMLElement>("[data-select-trailing-icon]");

    expect(trailingIconEl).not.toBeNull();

    const startsOpen = trailingIconEl!.getAttribute("data-open") === "true";

    expect(trailingIconEl!.textContent?.trim()).toBe(startsOpen ? "▲" : "▼");

    await getTrigger().click();
    await flushFocusUpdates();

    expect(trailingIconEl!.textContent?.trim()).toBe(startsOpen ? "▼" : "▲");
  });

  it("shows a checkmark on selected options in multi-select mode", async () => {
    const { findRenderedOptionElements, openMenu } = await renderAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR"],
    });

    await openMenu();

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
    const { findRenderedOptionElements, openMenu } = await renderAssembledSelect({
      options,
      multiple: true,
      hideSelected: true,
      modelValue: ["FR"],
    });

    await openMenu();

    const visibleValues = findRenderedOptionElements().map((option) => option.dataset.value);

    expect(visibleValues).not.toContain("FR");
    expect(visibleValues).toContain("GB");
  });

  it("keeps selected options visible in the dropdown by default", async () => {
    const { findRenderedOptionElements, openMenu } = await renderAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR"],
    });

    await openMenu();

    const visibleValues = findRenderedOptionElements().map((option) => option.dataset.value);

    expect(visibleValues).toContain("FR");
    expect(visibleValues).toContain("GB");
  });

  it("renders a custom empty state from the no-options slot when filtering has no results", async () => {
    const { getInput, getTeleportedPopoverElement, openMenu } = await renderAssembledSelect({
      options,
      searchable: true,
      slots: {
        "no-options": ({ searchValue }: { searchValue: string }) => `Nothing for "${searchValue}"`,
      },
    });

    await openMenu();
    await getInput().fill("zzzz");

    const noOptions = getTeleportedPopoverElement()?.querySelector("[data-select-no-options]");

    expect(noOptions?.textContent).toBe("Nothing for \"zzzz\"");
  });

  it("removes a selected value when clicking a tag remove button in searchable multi mode", async () => {
    const { model, screen } = await renderAssembledSelect({
      options,
      multiple: true,
      searchable: true,
      modelValue: ["FR", "GB"],
    });

    expect(screen.container.querySelectorAll("[data-select-tag]")).toHaveLength(2);

    await locateInContainer(screen.container, "[data-select-tag-remove]").click();

    expect(model.value).toEqual(["GB"]);
    expect(screen.container.querySelectorAll("[data-select-tag]")).toHaveLength(1);
  });

  it("renders a custom tag remove icon from the tag-remove slot", async () => {
    const { screen } = await renderAssembledSelect({
      options,
      multiple: true,
      modelValue: ["FR", "GB"],
      slots: {
        "tag-remove": () => "×",
      },
    });

    const removeButtons = screen.container.querySelectorAll("[data-select-tag-remove]");

    expect(removeButtons).toHaveLength(2);
    expect(Array.from(removeButtons).every((button) => button.textContent === "×")).toBe(true);
    expect(screen.container.querySelector("[data-select-tag-remove] svg")).toBeNull();
  });

  it("shows create item when search has no matches and emits create on click", async () => {
    const onCreate = vi.fn();
    const { getInput, getTeleportedPopoverElement, openMenu } = await renderAssembledSelect({
      options,
      createItem: true,
      onCreate,
    });

    await openMenu();
    await getInput().fill("Canada");

    const createItem = getTeleportedPopoverElement()?.querySelector("[data-select-create-item]");

    expect(createItem?.textContent?.trim()).toBe("Create \"Canada\"");
    expect(getTeleportedPopoverElement()?.querySelector("[data-select-no-options]")).toBeNull();

    createItem?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onCreate).toHaveBeenCalledWith("Canada");
  });

  it("renders a custom create item slot and keeps it visible in always mode", async () => {
    const { getInput, getTeleportedPopoverElement, openMenu } = await renderAssembledSelect({
      options,
      createItem: "always",
      slots: {
        "create-item": ({ searchValue }: { searchValue: string }) => `Add "${searchValue}"`,
      },
    });

    await openMenu();
    await getInput().fill("Fr");

    const createItem = getTeleportedPopoverElement()?.querySelector("[data-select-create-item]");

    expect(createItem?.textContent).toBe("Add \"Fr\"");
    expect(getTeleportedPopoverElement()?.querySelectorAll("[data-select-option]").length).toBeGreaterThan(0);
  });

  it("forwards popover props to SelectPopover", async () => {
    const { screen, getTrigger } = await renderAssembledSelect({
      options,
      teleport: false,
      side: "top",
      align: "end",
      sideOffset: 10,
      modal: false,
    });

    getTrigger().element().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushFocusUpdates();

    await expect.element(locateInContainer(screen.container, "[data-select-popover]")).toHaveAttribute("aria-hidden", "false");
  });
});
