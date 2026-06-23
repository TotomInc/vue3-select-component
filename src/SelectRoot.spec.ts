import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-vue";
import { page } from "vitest/browser";
import { defineComponent, h } from "vue";

import SelectClear from "./primitives/SelectClear.vue";
import SelectCreateItem from "./primitives/SelectCreateItem.vue";
import SelectGroup from "./primitives/SelectGroup.vue";
import SelectGroupLabel from "./primitives/SelectGroupLabel.vue";
import SelectInput from "./primitives/SelectInput.vue";
import SelectListbox from "./primitives/SelectListbox.vue";
import SelectNoOptions from "./primitives/SelectNoOptions.vue";
import SelectOption from "./primitives/SelectOption.vue";
import SelectPopover from "./primitives/SelectPopover.vue";
import SelectSeparator from "./primitives/SelectSeparator.vue";
import SelectTag from "./primitives/SelectTag.vue";
import SelectTrailingIcon from "./primitives/SelectTrailingIcon.vue";
import SelectTrigger from "./primitives/SelectTrigger.vue";
import SelectValue from "./primitives/SelectValue.vue";
import {
  cleanupTeleportedSelectContent,
  dispatchKeydown,
  flushFocusUpdates,
  getTeleportedPopoverElement,
  locateInContainer,
  queryHTMLElement,
} from "./test-utils/browser-select-helpers";
import {
  basicOptions,
  optionsWithDisabled,
  renderPrimitiveSelect,
  renderSelectRoot,
} from "./test-utils/render-primitive-select";

describe("v1 SelectRoot foundation", () => {
  afterEach(() => {
    cleanupTeleportedSelectContent();
  });

  it("renders the root shell and provides context to child primitives", async () => {
    const { screen, getValue } = await renderPrimitiveSelect();

    await expect.element(locateInContainer(screen.container, "[data-select-root]")).toBeVisible();
    await expect.element(locateInContainer(screen.container, "[data-select-trigger]")).toBeVisible();
    await expect.element(getValue()).toHaveTextContent("Pick a language");
  });

  it("closes the menu when clicking outside the select", async () => {
    const { getTrigger, getPopoverAriaHidden } = await renderPrimitiveSelect();
    const outside = document.createElement("button");

    document.body.append(outside);

    await getTrigger().click();
    expect(getPopoverAriaHidden()).toBe("false");

    outside.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(getPopoverAriaHidden()).toBe("true");

    outside.remove();
  });

  it("closes a teleported menu when clicking outside", async () => {
    const teleportTarget = document.createElement("div");
    teleportTarget.id = "v1-dismiss-teleport-target";
    document.body.append(teleportTarget);

    const outside = document.createElement("button");
    document.body.append(outside);

    const { getTrigger } = await renderSelectRoot({
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, { teleport: "#v1-dismiss-teleport-target" }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => basicOptions.map((option) =>
                  h(SelectOption, {
                    value: option.value,
                    label: option.label,
                  }),
                ),
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();

    const teleportedPopover = teleportTarget.querySelector("[data-select-popover]");
    expect(teleportedPopover?.getAttribute("aria-hidden")).toBe("false");

    outside.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(teleportedPopover?.getAttribute("aria-hidden")).toBe("true");

    outside.remove();
    teleportTarget.remove();
  });

  it("toggles menu open state from the trigger", async () => {
    const { screen, getTrigger, getPopoverAriaHidden } = await renderPrimitiveSelect();
    const trigger = getTrigger();

    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    expect(getPopoverAriaHidden()).toBe("true");

    await trigger.click();

    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
    expect(getPopoverAriaHidden()).toBe("false");
    expect(screen.container.querySelectorAll("[data-select-option]")).toHaveLength(2);
  });

  it("closes the menu when Tab moves focus outside a non-searchable trigger", async () => {
    const { getTrigger, getPopoverAriaHidden } = await renderPrimitiveSelect({ searchable: false });
    const outside = document.createElement("button");

    document.body.append(outside);

    await getTrigger().click();
    expect(getPopoverAriaHidden()).toBe("false");

    await dispatchKeydown(getTrigger(), "Tab");

    expect(getPopoverAriaHidden()).toBe("true");

    outside.remove();
  });

  it("closes the menu when focus moves outside a non-searchable select", async () => {
    const { getTrigger, getPopoverAriaHidden } = await renderPrimitiveSelect({ searchable: false });
    const outside = document.createElement("button");

    document.body.append(outside);

    await getTrigger().click();
    expect(getPopoverAriaHidden()).toBe("false");

    outside.focus();
    await flushFocusUpdates();

    expect(getPopoverAriaHidden()).toBe("true");

    outside.remove();
  });

  it("closes the menu when clicking the trigger again without reopening", async () => {
    const { getTrigger, getPopoverAriaHidden } = await renderPrimitiveSelect();
    const trigger = getTrigger();

    await trigger.click();
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");

    await trigger.click();

    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("updates v-model on single selection and closes the menu", async () => {
    const { screen, model, getTrigger, getValue, getPopoverAriaHidden } = await renderPrimitiveSelect();

    await getTrigger().click();
    await locateInContainer(screen.container, "[data-select-option][data-value='ts']").click();

    expect(model.value).toBe("ts");
    await expect.element(getValue()).toHaveTextContent("TypeScript");
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("registers declarative options in the collection", async () => {
    const { getTrigger } = await renderPrimitiveSelect();

    await getTrigger().click();

    expect(document.querySelector("[data-select-no-options]")).toBeNull();
    expect(page.getByRole("option").elements()).toHaveLength(2);
  });

  it("clears the model when clearable is enabled", async () => {
    const { screen, model, getValue } = await renderPrimitiveSelect({
      modelValue: "js",
      clearable: true,
    });

    const clearButton = locateInContainer(screen.container, "[data-select-clear]");

    await expect.element(clearButton).toBeVisible();

    await clearButton.click();

    expect(model.value).toBeNull();
    await expect.element(getValue()).toHaveTextContent("Pick a language");
  });

  it("renders custom clear button content from the SelectClear default slot", async () => {
    const { screen } = await renderSelectRoot({
      props: {
        modelValue: "js",
        clearable: true,
        options: [...basicOptions],
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => [
              h(SelectValue, { placeholder: "Pick a language" }),
              h(SelectClear, null, {
                default: () => "Reset",
              }),
            ],
          }),
        ],
      },
    });

    const clearButton = locateInContainer(screen.container, "[data-select-clear]");

    await expect.element(clearButton).toHaveTextContent("Reset");
    expect(clearButton.element().querySelector("svg")).toBeNull();
  });

  it("throws when a primitive is used outside SelectRoot", async () => {
    const OrphanTrigger = defineComponent({
      render: () => h(SelectTrigger),
    });

    await expect(async () => render(OrphanTrigger)).rejects.toThrow("injectSelectContext must be used within SelectRoot");
  });
});

describe("v1 SelectRoot core module", () => {
  afterEach(() => {
    cleanupTeleportedSelectContent();
  });

  it("supports multi-select toggling without closing the menu", async () => {
    const { screen, model, getTrigger, getPopoverAriaHidden } = await renderPrimitiveSelect({ multiple: true });

    await getTrigger().click();
    await locateInContainer(screen.container, "[data-select-option][data-value='js']").click();
    await locateInContainer(screen.container, "[data-select-option][data-value='ts']").click();

    expect(model.value).toEqual(["js", "ts"]);
    expect(getPopoverAriaHidden()).toBe("false");

    await locateInContainer(screen.container, "[data-select-option][data-value='js']").click();

    expect(model.value).toEqual(["ts"]);
  });

  it("shows a checkmark on selected options in multi-select mode", async () => {
    const { screen, getTrigger } = await renderPrimitiveSelect({ multiple: true });

    await getTrigger().click();
    await locateInContainer(screen.container, "[data-select-option][data-value='js']").click();

    const selectedOption = screen.container.querySelector("[data-select-option][data-value='js']");
    const unselectedOption = screen.container.querySelector("[data-select-option][data-value='ts']");

    expect(selectedOption?.querySelector("[data-select-option-checkmark] svg")).not.toBeNull();
    expect(unselectedOption?.querySelector("[data-select-option-checkmark]")).toBeNull();
  });

  it("hides selected options from the dropdown when hideSelected is enabled", async () => {
    const { screen, getTrigger } = await renderPrimitiveSelect({
      multiple: true,
      hideSelected: true,
      modelValue: ["js"],
    });

    await getTrigger().click();

    expect(screen.container.querySelector("[data-select-option][data-value='js']")).toBeNull();
    expect(screen.container.querySelector("[data-select-option][data-value='ts']")).not.toBeNull();
  });

  it("navigates with arrow keys and skips disabled options", async () => {
    const { screen, getTrigger, getListbox } = await renderPrimitiveSelect({ selectOptions: optionsWithDisabled });

    await getTrigger().click();
    await dispatchKeydown(getListbox(), "ArrowDown");

    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("ts");

    await dispatchKeydown(getListbox(), "ArrowUp");

    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("js");
  });

  it("selects the active option on Enter", async () => {
    const { model, getTrigger, getListbox, getPopoverAriaHidden } = await renderPrimitiveSelect();

    await getTrigger().click();
    await dispatchKeydown(getListbox(), "ArrowDown");
    await dispatchKeydown(getListbox(), "Enter");

    expect(model.value).toBe("ts");
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("opens the menu from the trigger with ArrowDown", async () => {
    const { getTrigger, getPopoverAriaHidden } = await renderPrimitiveSelect();

    await dispatchKeydown(getTrigger(), "ArrowDown");

    expect(getPopoverAriaHidden()).toBe("false");
  });

  it("moves one option per arrow key press from the search input", async () => {
    const { screen, getInput } = await renderPrimitiveSelect({
      searchable: true,
      selectOptions: [
        { label: "Alpha", value: "alpha" },
        { label: "Beta", value: "beta" },
        { label: "Gamma", value: "gamma" },
      ],
    });

    getInput().element().focus();
    await dispatchKeydown(getInput(), "ArrowDown");

    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("beta");

    await dispatchKeydown(getInput(), "ArrowUp");

    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("alpha");
  });

  it("wraps upward from the first option to the last option from the search input", async () => {
    const { screen, getInput } = await renderPrimitiveSelect({
      searchable: true,
      selectOptions: [
        { label: "Alpha", value: "alpha" },
        { label: "Beta", value: "beta" },
        { label: "Gamma", value: "gamma" },
      ],
    });

    getInput().element().focus();
    await dispatchKeydown(getInput(), "ArrowUp");

    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("gamma");
  });

  it("focuses the first matching option while typing in the search input", async () => {
    const { screen, getInput } = await renderPrimitiveSelect({
      searchable: true,
      selectOptions: [
        { label: "Alpha", value: "alpha" },
        { label: "Beta", value: "beta" },
        { label: "Gamma", value: "gamma" },
      ],
    });

    getInput().element().focus();
    await dispatchKeydown(getInput(), "ArrowDown");

    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("beta");

    await getInput().fill("a");

    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("alpha");
  });

  it("filters options and keeps the active option in the filtered set", async () => {
    const { screen, getTrigger, getInput, getListbox } = await renderPrimitiveSelect({ searchable: true });

    await getTrigger().click();
    await getInput().fill("type");
    await dispatchKeydown(getListbox(), "ArrowDown");

    expect(screen.container.querySelectorAll("[data-select-option]")).toHaveLength(1);
    expect(queryHTMLElement(screen.container, "[data-select-option]")?.dataset.value).toBe("ts");
    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("ts");
  });

  it("shows the empty state when filtering removes every option", async () => {
    const { screen, getTrigger, getInput } = await renderPrimitiveSelect({ searchable: true });

    await getTrigger().click();
    await getInput().fill("zzzz");

    expect(screen.container.querySelector("[data-select-no-options]")).not.toBeNull();
    expect(screen.container.querySelectorAll("[data-select-option]")).toHaveLength(0);
  });

  it("shows create item instead of the empty state when create-item is enabled", async () => {
    const onCreate = vi.fn();

    const { screen, getTrigger, getInput } = await renderSelectRoot({
      props: {
        options: [...basicOptions],
        searchable: true,
        createItem: true,
        onCreate,
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => [
              h(SelectValue, { placeholder: "Pick a language" }),
              h(SelectInput),
            ],
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => [
                  h(SelectNoOptions),
                  ...basicOptions.map((option) =>
                    h(SelectOption, {
                      value: option.value,
                      label: option.label,
                    }),
                  ),
                  h(SelectCreateItem),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();
    await getInput().fill("Rust");

    expect(screen.container.querySelector("[data-select-no-options]")).toBeNull();
    await expect.element(locateInContainer(screen.container, "[data-select-create-item]")).toHaveTextContent("Create \"Rust\"");

    await locateInContainer(screen.container, "[data-select-create-item]").click();

    expect(onCreate).toHaveBeenCalledWith("Rust");
  });

  it("selects create item with Enter when it is active", async () => {
    const onCreate = vi.fn();

    const { getTrigger, getInput } = await renderSelectRoot({
      props: {
        options: [...basicOptions],
        searchable: true,
        createItem: true,
        onCreate,
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => [
              h(SelectValue, { placeholder: "Pick a language" }),
              h(SelectInput),
            ],
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => [
                  h(SelectNoOptions),
                  ...basicOptions.map((option) =>
                    h(SelectOption, {
                      value: option.value,
                      label: option.label,
                    }),
                  ),
                  h(SelectCreateItem),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();
    await getInput().fill("Rust");
    await dispatchKeydown(getInput(), "Enter");

    expect(onCreate).toHaveBeenCalledWith("Rust");
  });

  it("passes searchValue to the SelectNoOptions default slot", async () => {
    const { screen, getTrigger, getInput } = await renderSelectRoot({
      props: {
        options: [...basicOptions],
        searchable: true,
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => [
              h(SelectValue, { placeholder: "Pick a language" }),
              h(SelectInput),
            ],
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => [
                  h(SelectNoOptions, null, {
                    default: ({ searchValue }: { searchValue: string }) => `No match for "${searchValue}"`,
                  }),
                  ...basicOptions.map((option) =>
                    h(SelectOption, {
                      value: option.value,
                      label: option.label,
                    }),
                  ),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();
    await getInput().fill("zzzz");

    await expect.element(locateInContainer(screen.container, "[data-select-no-options]")).toHaveTextContent("No match for \"zzzz\"");
  });

  it("resolves options from the options prop without declarative duplicates", async () => {
    const { screen, getTrigger, getInput } = await renderSelectRoot({
      props: {
        options: [...optionsWithDisabled],
        searchable: true,
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => [
              h(SelectValue, { placeholder: "Pick a language" }),
              h(SelectInput),
            ],
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => [
                  h(SelectNoOptions),
                  ...optionsWithDisabled.map((option) =>
                    h(SelectOption, {
                      value: option.value,
                      label: option.label,
                      disabled: "disabled" in option ? option.disabled : false,
                    }),
                  ),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();
    await getInput().fill("type");

    expect(screen.container.querySelectorAll("[data-select-option]")).toHaveLength(1);
    expect(queryHTMLElement(screen.container, "[data-select-option]")?.dataset.value).toBe("ts");
  });

  it("removes the last selected value on Backspace in multi-select mode", async () => {
    const { model, getTrigger, getListbox } = await renderPrimitiveSelect({
      multiple: true,
      modelValue: ["js", "ts"],
    });

    await getTrigger().click();
    await dispatchKeydown(getListbox(), "Backspace");

    expect(model.value).toEqual(["js"]);
  });
});

describe("v1 primitive composition", () => {
  afterEach(() => {
    cleanupTeleportedSelectContent();
  });

  it("renders grouped options with labelled groups and separators", async () => {
    const { screen, getTrigger } = await renderSelectRoot({
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => [
                  h(SelectGroup, null, {
                    default: () => [
                      h(SelectGroupLabel, null, { default: () => "Frontend" }),
                      h(SelectOption, { value: "js", label: "JavaScript" }),
                      h(SelectOption, { value: "ts", label: "TypeScript" }),
                    ],
                  }),
                  h(SelectSeparator),
                  h(SelectGroup, null, {
                    default: () => [
                      h(SelectGroupLabel, null, { default: () => "Systems" }),
                      h(SelectOption, { value: "rs", label: "Rust" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();

    const groups = screen.container.querySelectorAll("[data-select-group]");
    const labels = screen.container.querySelectorAll("[data-select-group-label]");

    expect(groups).toHaveLength(2);
    expect(Array.from(labels).map((label) => label.textContent)).toEqual(["Frontend", "Systems"]);
    expect(groups[0]?.getAttribute("role")).toBe("group");
    expect(groups[0]?.getAttribute("aria-labelledby")).toBe(labels[0]?.id);
    expect(screen.container.querySelector("[data-select-separator]")?.getAttribute("role")).toBe("separator");
    expect(screen.container.querySelectorAll("[data-select-option]")).toHaveLength(3);
  });

  it("keeps keyboard navigation on grouped options only", async () => {
    const { screen, model, getTrigger, getListbox } = await renderSelectRoot({
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => [
                  h(SelectGroup, null, {
                    default: () => [
                      h(SelectGroupLabel, null, { default: () => "Frontend" }),
                      h(SelectOption, { value: "js", label: "JavaScript" }),
                      h(SelectOption, { value: "ts", label: "TypeScript" }),
                    ],
                  }),
                  h(SelectSeparator),
                  h(SelectGroup, null, {
                    default: () => [
                      h(SelectGroupLabel, null, { default: () => "Systems" }),
                      h(SelectOption, { value: "rs", label: "Rust" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();
    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("js");

    await dispatchKeydown(getListbox(), "ArrowDown");
    await dispatchKeydown(getListbox(), "ArrowDown");

    expect(screen.container.querySelector<HTMLElement>("[data-select-option][data-active='true']")?.dataset.value).toBe("rs");

    await dispatchKeydown(getListbox(), "Enter");

    expect(model.value).toBe("rs");
  });

  it("hides a group when filtering hides all of its options", async () => {
    const { screen, getTrigger, getInput } = await renderSelectRoot({
      props: {
        searchable: true,
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => [
              h(SelectValue, { placeholder: "Pick a language" }),
              h(SelectInput),
            ],
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => [
                  h(SelectGroup, null, {
                    default: () => [
                      h(SelectGroupLabel, null, { default: () => "Frontend" }),
                      h(SelectOption, { value: "js", label: "JavaScript" }),
                      h(SelectOption, { value: "ts", label: "TypeScript" }),
                    ],
                  }),
                  h(SelectGroup, null, {
                    default: () => [
                      h(SelectGroupLabel, null, { default: () => "Systems" }),
                      h(SelectOption, { value: "rs", label: "Rust" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();
    await getInput().fill("rust");
    await flushFocusUpdates();

    const groups = screen.container.querySelectorAll("[data-select-group]");

    await expect.element(page.elementLocator(groups[0] as HTMLElement)).not.toBeVisible();
    await expect.element(page.elementLocator(groups[1] as HTMLElement)).toBeVisible();
    expect(screen.container.querySelectorAll("[data-select-option]")).toHaveLength(1);
    expect(queryHTMLElement(screen.container, "[data-select-option]")?.dataset.value).toBe("rs");
  });

  it("renders multi-select tags and removes a value from the tag button", async () => {
    const { screen, model } = await renderPrimitiveSelect({
      multiple: true,
      modelValue: ["js", "ts"],
      usePropOptions: true,
    });

    const tags = screen.container.querySelectorAll("[data-select-tag]");
    expect(tags).toHaveLength(2);
    expect(tags[0]?.textContent).toContain("JavaScript");
    expect(tags[1]?.textContent).toContain("TypeScript");

    await locateInContainer(screen.container, "[data-select-tag-remove]").click();

    expect(model.value).toEqual(["ts"]);
    expect(screen.container.querySelectorAll("[data-select-tag]")).toHaveLength(1);
  });

  it("exposes loading state on the trailing icon primitive", async () => {
    const { screen } = await renderSelectRoot({
      props: {
        loading: true,
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectTrailingIcon),
          }),
        ],
      },
    });

    await expect.element(locateInContainer(screen.container, "[data-select-trailing-icon]")).toHaveAttribute("data-loading", "true");
  });

  it("renders a default chevron in the trailing icon primitive", async () => {
    const { screen, getTrigger } = await renderSelectRoot({
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectTrailingIcon),
          }),
        ],
      },
    });

    const trailingIcon = locateInContainer(screen.container, "[data-select-trailing-icon]");

    expect(trailingIcon.element().querySelector("svg")).not.toBeNull();
    await expect.element(trailingIcon).toHaveAttribute("data-open", "false");

    await getTrigger().click();

    await expect.element(trailingIcon).toHaveAttribute("data-open", "true");
  });

  it("renders a default remove icon in SelectTag", async () => {
    const { screen } = await renderSelectRoot({
      props: {
        modelValue: ["js"],
        multiple: true,
        options: [...basicOptions],
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectTag, { value: "js", label: "JavaScript" }),
          }),
        ],
      },
    });

    expect(screen.container.querySelector("[data-select-tag-remove] svg")).not.toBeNull();
  });

  it("forwards a custom remove icon from SelectValue tag-remove slot", async () => {
    const { screen } = await renderSelectRoot({
      props: {
        modelValue: ["js"],
        multiple: true,
        options: [...basicOptions],
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }, {
              "tag-remove": ({ label }: { label: string }) => `Remove ${label}`,
            }),
          }),
        ],
      },
    });

    await expect.element(locateInContainer(screen.container, "[data-select-tag-remove]")).toHaveTextContent("Remove JavaScript");
    expect(screen.container.querySelector("[data-select-tag-remove] svg")).toBeNull();
  });

  it("keeps the menu open on single-select when closeOnSelect is false", async () => {
    const { screen, model, getTrigger, getPopoverAriaHidden } = await renderSelectRoot({
      props: {
        closeOnSelect: false,
        options: [...basicOptions],
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => basicOptions.map((option) =>
                  h(SelectOption, {
                    value: option.value,
                    label: option.label,
                  }),
                ),
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();
    await locateInContainer(screen.container, "[data-select-option][data-value='js']").click();

    expect(model.value).toBe("js");
    expect(getPopoverAriaHidden()).toBe("false");
  });

  it("closes the menu on multi-select when closeOnSelect is enabled", async () => {
    const { screen, model, getTrigger, getPopoverAriaHidden } = await renderSelectRoot({
      props: {
        modelValue: [],
        multiple: true,
        closeOnSelect: true,
        options: [...basicOptions],
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => basicOptions.map((option) =>
                  h(SelectOption, {
                    value: option.value,
                    label: option.label,
                  }),
                ),
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();
    await locateInContainer(screen.container, "[data-select-option][data-value='js']").click();

    expect(model.value).toEqual(["js"]);
    expect(getPopoverAriaHidden()).toBe("true");
  });

  it("wires the searchable input and listbox ids for aria-activedescendant", async () => {
    const { screen, getTrigger, getInput, getListbox } = await renderPrimitiveSelect({ searchable: true });

    await getTrigger().click();
    await dispatchKeydown(getListbox(), "ArrowDown");

    const input = getInput().element();
    const listbox = getListbox().element();
    const activeOption = screen.container.querySelector("[data-select-option][data-active='true']");

    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-controls")).toBe(listbox.id);
    expect(input.getAttribute("aria-activedescendant")).toBe(activeOption?.id);
    expect(listbox.getAttribute("aria-labelledby")).toBe(input.id);
  });

  it("teleports the popover to body by default", async () => {
    const { screen, getTrigger } = await renderSelectRoot({
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, null, {
            default: () => [
              h(SelectListbox, null, {
                default: () => basicOptions.map((option) =>
                  h(SelectOption, {
                    value: option.value,
                    label: option.label,
                  }),
                ),
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();

    const teleportedPopover = getTeleportedPopoverElement();

    expect(teleportedPopover).not.toBeNull();
    expect(teleportedPopover?.getAttribute("aria-hidden")).toBe("false");
    expect(screen.container.querySelector("[data-select-popover]")).toBeNull();
  });

  it("renders the popover inline when teleport is false", async () => {
    const { screen, getTrigger, getPopoverAriaHidden } = await renderPrimitiveSelect();

    getTrigger().element().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushFocusUpdates();

    expect(getPopoverAriaHidden()).toBe("false");

    const popover = screen.container.querySelector("[data-select-popover]");

    expect(popover).not.toBeNull();
    expect(popover?.closest("[data-select-root]")).not.toBeNull();
  });

  it("teleports the popover to a custom target when a selector is provided", async () => {
    const teleportTarget = document.createElement("div");
    teleportTarget.id = "v1-teleport-target";
    document.body.appendChild(teleportTarget);

    const { screen, getTrigger } = await renderSelectRoot({
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, { teleport: "#v1-teleport-target" }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => basicOptions.map((option) =>
                  h(SelectOption, {
                    value: option.value,
                    label: option.label,
                  }),
                ),
              }),
            ],
          }),
        ],
      },
    });

    await getTrigger().click();

    const teleportedPopover = teleportTarget.querySelector("[data-select-popover]");

    expect(teleportedPopover).not.toBeNull();
    expect(teleportedPopover?.getAttribute("aria-hidden")).toBe("false");
    expect(screen.container.querySelector("[data-select-popover]")).toBeNull();

    teleportTarget.remove();
  });

  it("forwards reka-ui popover content props to SelectPopover", async () => {
    const { screen, getTrigger } = await renderSelectRoot({
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, {
            teleport: false,
            side: "top",
            align: "end",
            sideOffset: 12,
            modal: false,
          }, {
            default: () => [
              h(SelectListbox, null, {
                default: () => basicOptions.map((option) =>
                  h(SelectOption, {
                    value: option.value,
                    label: option.label,
                  }),
                ),
              }),
            ],
          }),
        ],
      },
    });

    getTrigger().element().dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushFocusUpdates();

    await expect.element(locateInContainer(screen.container, "[data-select-popover]")).toHaveAttribute("aria-hidden", "false");
  });

  it("renders a standalone SelectTag when composed manually", async () => {
    const { screen, model } = await renderSelectRoot({
      props: {
        modelValue: ["js"],
        multiple: true,
        options: [...basicOptions],
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectTag, { value: "js", label: "JavaScript" }),
          }),
        ],
      },
    });

    await locateInContainer(screen.container, "[data-select-tag-remove]").click();

    expect(model.value).toEqual([]);
  });
});
