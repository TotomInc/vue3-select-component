import type { Option } from "./types";
import { mount } from "@vue/test-utils";

import { describe, expect, it } from "vitest";
import VueSelect from "./Select.vue";

const options = [
  { label: "France", value: "FR" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Germany", value: "DE" },
];

async function openMenu(wrapper: ReturnType<typeof mount>, method: "mousedown" | "focus-space" | "single-value" = "mousedown") {
  if (method === "mousedown") {
    await wrapper.get("input").trigger("mousedown");
  }
  else if (method === "focus-space") {
    await wrapper.get("input").trigger("focus");
    await wrapper.get("input").trigger("keydown", { code: "Space" });
  }
  else if (method === "single-value") {
    await wrapper.get(".single-value").trigger("click");
  }
}

async function dispatchEvent(wrapper: ReturnType<typeof mount>, event: Event) {
  document.dispatchEvent(event);
  await wrapper.vm.$nextTick();
};

async function inputSearch(wrapper: ReturnType<typeof mount>, search: string) {
  await wrapper.get("input").setValue(search);
}

it("should render the component", () => {
  const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

  expect(wrapper.exists()).toBe(true);
});

describe("input + menu interactions behavior", () => {
  it("should not open the menu when focusing the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("focus");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should open the menu when triggering mousedown on the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should open the menu when focusing the input and pressing space", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper, "focus-space");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should open the menu when clicking on the dropdown button", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get(".dropdown-icon").trigger("click");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should not open the menu when is-disabled and an option is selected", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: options[0].value, options, isDisabled: true } });

    await openMenu(wrapper, "single-value");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should close the menu after focusing and pressing tab", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    await wrapper.get("input").trigger("keydown", { key: "Tab" });

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should close the menu when clicking outside the menu", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    await dispatchEvent(wrapper, new MouseEvent("mousedown"));

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should close the menu when hitting escape", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("mousedown");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Escape" }));

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should close the menu when clicking on the dropdown button", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    await wrapper.get(".dropdown-icon").trigger("click");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should open the menu when isMenuOpen prop is set to true", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isMenuOpen: true } });

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should close the menu when isMenuOpen prop is set to false", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isMenuOpen: true } });

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    await wrapper.setProps({ isMenuOpen: false });

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });
});

describe("menu on-open focus option", async () => {
  it("should focus the first option when opening the menu", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0].label);
  });

  it("should focus the first available available option when a disabled option is at the first index", async () => {
    const options = [
      { label: "Spain", value: "ES", disabled: true },
      { label: "France", value: "FR" },
    ];

    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.get(".focused[role='option']").text()).toBe("France");
  });
});

describe("menu keyboard navigation", () => {
  it("should navigate through the options with the arrow keys", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[1].label);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowUp" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0].label);
  });

  it("should navigate through the options with the arrow keys and skip disabled options", async () => {
    const options = [
      { label: "France", value: "FR" },
      { label: "Spain", value: "ES", disabled: true },
      { label: "United Kingdom", value: "GB" },
    ];

    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[2].label);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowUp" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0].label);
  });
});

describe("menu filtering", () => {
  it("should filter the options when typing in the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await inputSearch(wrapper, "United");

    expect(wrapper.findAll("div[role='option']").length).toBe(2);

    await inputSearch(wrapper, "United States");

    expect(wrapper.findAll("div[role='option']").length).toBe(1);
  });
});

describe("single-select option", () => {
  it("should select an option when clicking on it", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("should select an option when focusing and pressing enter", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("should select an option when pressing space", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    // Triggering space event with KeyboardEvent constructor is a bit tricky. Must be done like this:
    const event = new KeyboardEvent("keydown", {});
    Object.defineProperty(event, "code", { value: "Space" });
    Object.defineProperty(event, "key", { value: " " });
    document.dispatchEvent(event);

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("should remove the selected option when pressing backspace without typing", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Backspace" }));

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value], [undefined]]);
    expect(wrapper.find(".single-value").exists()).toBe(false);
  });

  it("should not remove the selected option when pressing backspace after typing", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);

    await inputSearch(wrapper, "F");
    await wrapper.get("input").trigger("keydown", { key: "Backspace" });

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0].label);
  });

  it("cannot select an option when there are no matching options", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await inputSearch(wrapper, "Foo");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("cannot select a disabled option", async () => {
    const options = [{ label: "Spain", value: "ES", disabled: true }];
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("should autofocus the first option when opening the menu, by default", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0].label);
  });
});

describe("multi-select options", () => {
  it("should select an option when clicking on it", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.props("modelValue")).toStrictEqual([options[0].value]);
    expect(wrapper.get(".multi-value").element.textContent).toBe(options[0].label);
  });

  it("should display non-selected remaining options on the list", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll(".menu-option").length).toBe(options.length - 1);
  });

  it("should remove a selected option and be able to select it again", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll(".menu-option").length).toBe(options.length - 1);

    await wrapper.get(".multi-value").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll(".menu-option").length).toBe(options.length);
    expect(wrapper.findAll(".multi-value").length).toBe(0);
  });
});

describe("clear button", () => {
  it("should clear the selected option when clicking on the clear button", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isClearable: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await wrapper.get(".clear-button").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0].value], [undefined]]);
    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });

  it("should clear all selected options when clicking on the clear button with isMulti prop", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, isClearable: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await wrapper.get(".clear-button").trigger("click");

    expect(wrapper.props("modelValue")).toStrictEqual([options[0].value]);
    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });
});

describe("search emit", () => {
  it("should emit the search event when typing in the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await inputSearch(wrapper, "United");

    expect(wrapper.emitted("search")).toStrictEqual([["United"]]);
  });

  it("should emit an empty string for the search when the menu is closed", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await inputSearch(wrapper, "United");
    await dispatchEvent(wrapper, new MouseEvent("mousedown"));

    expect(wrapper.emitted("search")).toStrictEqual([["United"], [""]]);
  });
});

describe("component slots", () => {
  it("should render custom clear button content", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: options[0].value, options },
      slots: { clear: "X" },
    });

    const clearButton = wrapper.get(".clear-button");
    expect(clearButton.text()).toBe("X");
  });

  it("should render custom dropdown button content", () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: null, options },
      slots: { dropdown: "V" },
    });

    const dropdownButton = wrapper.get(".dropdown-icon");
    expect(dropdownButton.text()).toBe("V");
  });

  it("should still emit events when using custom button content", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: options[0].value, options },
      slots: { clear: "X", dropdown: "V" },
    });

    await wrapper.get(".clear-button").trigger("click");
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[undefined]]);

    await wrapper.get(".dropdown-icon").trigger("click");
    expect(wrapper.emitted("menuOpened")).toBeTruthy();
  });
});

describe("component props", () => {
  it("should use getOptionValue prop to get custom option value", async () => {
    const options = [
      { id: "Admin", key: "admin" },
      { id: "User", key: "user" },
    ];

    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options: options as unknown as Option<string>[],
        getOptionValue: (option: any) => option.key,
      },
    });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([["admin"]]);
  });

  it("should use getOptionLabel prop to display custom option label", async () => {
    const options = [
      { id: "Admin", key: "admin" },
      { id: "User", key: "user" },
    ];

    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options: options as unknown as Option<string>[],
        getOptionLabel: (option: any) => option.id,
      },
    });

    await openMenu(wrapper);

    const optionElements = wrapper.findAll("div[role='option']");
    expect(optionElements[0].text()).toBe("Admin");
    expect(optionElements[1].text()).toBe("User");

    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.get(".single-value").text()).toBe("Admin");
  });

  it("should display the placeholder in the input when no option is selected", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, placeholder: "Pick an option" } });

    expect(wrapper.find("input").attributes("placeholder")).toBe("Pick an option");
  });

  it("should disable the input when passing the isDisabled prop", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isDisabled: true } });

    expect(wrapper.get("input").attributes("disabled")).toBe("");
  });

  it("should not filter menu options when isSearchable prop is set to false", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isSearchable: false } });

    await openMenu(wrapper);
    await inputSearch(wrapper, "United");

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should not autofocus an option when passing the autofocus prop", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, shouldAutofocusOption: false } });

    await openMenu(wrapper);

    expect(wrapper.findAll(".focused[role='option']")).toHaveLength(0);
  });
});

describe("taggable prop", () => {
  it("should emit option-created event when pressing enter with search value", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isTaggable: true } });

    await openMenu(wrapper);
    await inputSearch(wrapper, "New Option");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.emitted("optionCreated")).toStrictEqual([["New Option"]]);
  });

  it("should emit option-created event when clicking on the create option button", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isTaggable: true } });

    await openMenu(wrapper);
    await inputSearch(wrapper, "New Option");
    await wrapper.get(".taggable-no-options").trigger("click");

    expect(wrapper.emitted("optionCreated")).toStrictEqual([["New Option"]]);
  });

  it("should display the taggable-no-options slot when there are no matching options", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: null, options, isTaggable: true },
      slots: {
        "taggable-no-options": `<template #taggable-no-options="{ option }">
          <div class="custom-taggable-no-options">Create option: {{ option }}</div>
        </template>`,
      },
    });

    await openMenu(wrapper);
    await inputSearch(wrapper, "New Option");

    expect(wrapper.find(".custom-taggable-no-options").exists()).toBe(true);
    expect(wrapper.find(".custom-taggable-no-options").text()).toBe("Create option: New Option");
  });
});
