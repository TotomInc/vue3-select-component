import type { Option } from "./types/option";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h } from "vue";

import VueSelect from "./Select.vue";

const options = [
  { label: "France", value: "FR" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Germany", value: "DE" },
];

async function openMenu(wrapper: ReturnType<typeof mount>, method: "mousedown" | "focus-space" | "single-value" = "mousedown") {
  // Check if menu is already closed, if so proceed normally
  // If menu is open, use the dropdown toggle button instead to avoid the new toggle logic
  const isMenuOpen = wrapper.findAll("div[role='option']").length > 0;

  if (method === "mousedown") {
    if (isMenuOpen) {
      // Menu is open, close it first then reopen
      await wrapper.get(".dropdown-icon").trigger("click");
    }

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

describe("input + menu interactions behavior", () => {
  it("should display the placeholder when no option is selected", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, placeholder: "Select an option" } });

    expect(wrapper.find(".input-placeholder").text()).toBe("Select an option");
  });

  it("should display the placeholder slot", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: null, options, placeholder: "placeholder prop" },
      slots: {
        placeholder: () => h("div", { class: "custom-placeholder" }, "Custom placeholder"),
      },
    });

    expect(wrapper.find(".custom-placeholder").exists()).toBe(true);
    expect(wrapper.get(".custom-placeholder").text()).toBe("Custom placeholder");
  });

  it("should not open the menu when focusing the input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("focus");

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should not open the menu when is-disabled and an option is selected", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: options[0]?.value, options, isDisabled: true } });

    await openMenu(wrapper, "single-value");

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

describe("menu keyboard navigation", () => {
  it("should navigate through the options with the arrow keys", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[1]?.label);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowUp" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0]?.label);
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

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[2]?.label);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowUp" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0]?.label);
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

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0]?.value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0]?.label);
  });

  it("should select an option when focusing and pressing enter", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Enter" }));

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0]?.value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0]?.label);
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

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0]?.value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0]?.label);
  });

  it("should remove the selected option when pressing backspace without typing", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0]?.value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0]?.label);

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Backspace" }));

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0]?.value], [undefined]]);
    expect(wrapper.find(".single-value").exists()).toBe(false);
  });

  it("should not remove the selected option when pressing backspace after typing", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0]?.value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0]?.label);

    await inputSearch(wrapper, "F");
    await wrapper.get("input").trigger("keydown", { key: "Backspace" });

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0]?.value]]);
    expect(wrapper.get(".single-value").element.textContent).toBe(options[0]?.label);
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
});

describe("multi-select options", () => {
  it("should select an option when clicking on it", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[[options[0]?.value]]]);
    expect(wrapper.get(".multi-value").element.textContent).toBe(options[0]?.label);
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

    await wrapper.get(".multi-value-remove").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll(".menu-option").length).toBe(options.length);
    expect(wrapper.findAll(".multi-value").length).toBe(0);
  });
});

describe("option-deselected event", () => {
  it("should emit option-deselected when removing a tag via click in multi-select", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("optionDeselected")).toBeUndefined();

    await wrapper.get(".multi-value-remove").trigger("click");

    const emittedEvents = wrapper.emitted("optionDeselected");
    expect(emittedEvents).toBeDefined();
    expect(emittedEvents?.[0]?.[0]).toEqual(options[0]);
  });

  it("should emit option-deselected when removing a tag via backspace in multi-select", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("optionDeselected")).toBeUndefined();

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Backspace" }));

    const emittedEvents = wrapper.emitted("optionDeselected");
    expect(emittedEvents).toBeDefined();
    expect(emittedEvents?.[0]?.[0]).toEqual(options[0]);
  });

  it("should emit option-deselected when removing via backspace in single-select", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.emitted("optionDeselected")).toBeUndefined();

    await wrapper.get("input").trigger("mousedown");
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Backspace" }));

    const emittedEvents = wrapper.emitted("optionDeselected");
    expect(emittedEvents).toBeDefined();
    expect(emittedEvents?.[0]?.[0]).toEqual(options[0]);
  });

  it("should emit option-deselected with null when clearing all options in multi-select", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, isClearable: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await wrapper.get(".clear-button").trigger("click");

    const emittedEvents = wrapper.emitted("optionDeselected");
    expect(emittedEvents).toBeDefined();
    expect(emittedEvents?.[0]?.[0]).toBeNull();
  });
});

describe("clear button", () => {
  it("should display the clear button when an option is selected", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isClearable: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.find(".clear-button").exists()).toBe(true);
  });

  it("should clear the selected option when clicking on the clear button", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isClearable: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await wrapper.get(".clear-button").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[0]?.value], [undefined]]);
    expect(wrapper.find(".clear-button").exists()).toBe(false);
  });

  it("should clear all selected options when clicking on the clear button with isMulti prop", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, isClearable: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await wrapper.get(".clear-button").trigger("click");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[[options[0]?.value]], [[]]]);
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
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Escape" }));

    expect(wrapper.emitted("search")).toStrictEqual([["United"], [""]]);
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
    expect(optionElements[0]?.text()).toBe("Admin");
    expect(optionElements[1]?.text()).toBe("User");

    await wrapper.get("div[role='option']").trigger("click");

    expect(wrapper.get(".single-value").text()).toBe("Admin");
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

  it("should not allow focusing or typing when isSearchable is false", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, isSearchable: false } });

    const input = wrapper.get("input");

    // Input should be readonly and removed from tab order
    expect(input.attributes("readonly")).toBe("");
    expect(input.attributes("tabindex")).toBe("-1");

    // Focus attempt should not set focus-visible behavior or allow typing to change value
    await input.trigger("focus");
    await input.setValue("United");

    // Menu shouldn't open due to typing, and no search event should be emitted
    expect(wrapper.findAll("div[role='option']").length).toBe(0);
    expect(wrapper.emitted("search")).toBeUndefined();

    // Opening the menu via control still works
    await openMenu(wrapper, "mousedown");
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should not autofocus an option when passing the autofocus prop", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, shouldAutofocusOption: false } });

    await openMenu(wrapper);

    expect(wrapper.findAll(".focused[role='option']")).toHaveLength(0);
  });
});

describe("inputAttrs prop", () => {
  it("should apply custom tabindex from inputAttrs", () => {
    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options,
        inputAttrs: { tabindex: 5 },
      },
    });

    expect(wrapper.get("input").attributes("tabindex")).toBe("5");
  });

  it("should apply custom autocomplete from inputAttrs", () => {
    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options,
        inputAttrs: { autocomplete: "country" },
      },
    });

    expect(wrapper.get("input").attributes("autocomplete")).toBe("country");
  });

  it("should apply required attribute from inputAttrs", () => {
    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options,
        inputAttrs: { required: true },
      },
    });

    expect(wrapper.get("input").attributes("required")).toBe("");
  });

  it("should apply multiple custom attributes from inputAttrs", () => {
    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options,
        inputAttrs: {
          "tabindex": 3,
          "autocomplete": "username",
          "required": true,
          "data-testid": "custom-select",
        },
      },
    });

    const input = wrapper.get("input");
    expect(input.attributes("tabindex")).toBe("3");
    expect(input.attributes("autocomplete")).toBe("username");
    expect(input.attributes("required")).toBe("");
    expect(input.attributes("data-testid")).toBe("custom-select");
  });

  it("should override default attributes with inputAttrs", () => {
    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options,
        inputAttrs: {
          spellcheck: true,
          autocorrect: "on",
        },
      },
    });

    const input = wrapper.get("input");
    expect(input.attributes("spellcheck")).toBe("true");
    expect(input.attributes("autocorrect")).toBe("on");
  });

  it("should preserve essential attributes when inputAttrs is provided", () => {
    const wrapper = mount(VueSelect, {
      props: {
        modelValue: null,
        options,
        inputAttrs: { tabindex: 5 },
      },
    });

    const input = wrapper.get("input");
    expect(input.attributes("type")).toBe("text");
    expect(input.attributes("aria-autocomplete")).toBe("list");
    expect(input.attributes("placeholder")).toBe("");
  });

  it("should work without inputAttrs prop", () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    const input = wrapper.get("input");
    expect(input.attributes("tabindex")).toBe("0");
    expect(input.attributes("autocomplete")).toBe("off");
    expect(input.attributes("spellcheck")).toBe("false");
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

describe("tag-content slot", () => {
  it("should render custom tag content using tag-content slot", () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: ["FR", "GB"], options, isMulti: true },
      slots: {
        "tag-content": `<template #tag-content="{ option }">
          <strong class="custom-tag-content">{{ option.label.toUpperCase() }}</strong>
        </template>`,
      },
    });

    const customTagContent = wrapper.findAll(".custom-tag-content");
    expect(customTagContent.length).toBe(2);
    expect(customTagContent[0]?.text()).toBe("FRANCE");
    expect(customTagContent[1]?.text()).toBe("UNITED KINGDOM");
  });

  it("should preserve remove button functionality with tag-content slot", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: ["FR", "GB"], options, isMulti: true },
      slots: {
        "tag-content": `<template #tag-content="{ option }">
          <span class="custom-tag-content">{{ option.label }}</span>
        </template>`,
      },
    });

    const removeButtons = wrapper.findAll(".multi-value-remove");
    expect(removeButtons.length).toBe(2);

    await removeButtons[0]?.trigger("click");

    expect(wrapper.emitted("optionDeselected")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[["GB"]]]);
  });

  it("should pass option data correctly to tag-content slot", () => {
    const extendedOptions: Option<string>[] = [
      { label: "France", value: "FR", extra: "FRA" },
      { label: "United Kingdom", value: "GB", extra: "GBR" },
    ];

    const wrapper = mount(VueSelect, {
      props: { modelValue: ["FR"], options: extendedOptions, isMulti: true },
      slots: {
        "tag-content": `<template #tag-content="{ option }">
          <span class="custom-tag-content" :data-extra="option.extra">{{ option.label }}</span>
        </template>`,
      },
    });

    const customTagContent = wrapper.find(".custom-tag-content");
    expect(customTagContent.exists()).toBe(true);
    expect(customTagContent.text()).toBe("France");
    expect(customTagContent.attributes("data-extra")).toBe("FRA");
  });

  it("should prioritize tag slot over tag-content slot when both are provided", () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: ["FR"], options, isMulti: true },
      slots: {
        "tag": `<template #tag="{ option }">
          <div class="full-custom-tag">{{ option.label }}</div>
        </template>`,
        "tag-content": `<template #tag-content="{ option }">
          <span class="custom-tag-content">{{ option.label }}</span>
        </template>`,
      },
    });

    expect(wrapper.find(".full-custom-tag").exists()).toBe(true);
    expect(wrapper.find(".custom-tag-content").exists()).toBe(false);
    expect(wrapper.find(".multi-value").exists()).toBe(false);
  });

  it("should maintain default styling with tag-content slot", () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: ["FR"], options, isMulti: true },
      slots: {
        "tag-content": `<template #tag-content="{ option }">
          <span>{{ option.label }}</span>
        </template>`,
      },
    });

    expect(wrapper.find(".multi-value").exists()).toBe(true);
    expect(wrapper.find(".multi-value-label").exists()).toBe(true);
    expect(wrapper.find(".multi-value-remove").exists()).toBe(true);
  });
});

describe("menu autofocus behavior", () => {
  it("should autofocus first option when opening menu", async () => {
    const testCases = [
      { name: "single-select", props: { modelValue: null, options } },
      { name: "multi-select", props: { modelValue: [], isMulti: true, options } },
    ];

    for (const testCase of testCases) {
      // @ts-expect-error -- ignore type error
      const wrapper = mount(VueSelect, { props: testCase.props });
      await openMenu(wrapper);
      expect(wrapper.get(".focused[role='option']").text()).toBe(options[0]?.label);
    }
  });

  it("should focus first available option when first option is disabled", async () => {
    const options = [
      { label: "Spain", value: "ES", disabled: true },
      { label: "France", value: "FR" },
    ];

    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });
    await openMenu(wrapper);
    expect(wrapper.get(".focused[role='option']").text()).toBe("France");
  });
});

describe("menu opening behavior", () => {
  it("should open menu with different triggers", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    const triggers = [
      { name: "mousedown on input", action: async () => await openMenu(wrapper, "mousedown") },
      { name: "space after focus", action: async () => await openMenu(wrapper, "focus-space") },
      { name: "dropdown button click", action: async () => await wrapper.get(".dropdown-icon").trigger("click") },
    ];

    for (const trigger of triggers) {
      await trigger.action();
      expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
      await wrapper.get(".dropdown-icon").trigger("click");
    }
  });
});

describe("teleport class propagation", () => {
  it("adds root custom class to teleported menu", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: null, options, teleport: "body" },
      attrs: { class: "custom-select" },
    });

    await openMenu(wrapper);

    const menus = Array.from(document.body.querySelectorAll(".menu"));
    const menuEl = menus[menus.length - 1] as HTMLElement | undefined;

    expect(menuEl).toBeTruthy();
    if (!menuEl) {
      return;
    };

    // Should have user-defined class copied from root container
    expect(menuEl.classList.contains("custom-select")).toBe(true);

    // Should not copy internal classes
    expect(menuEl.classList.contains("vue-select")).toBe(false);
    expect(menuEl.classList.contains("open")).toBe(false);
    expect(menuEl.classList.contains("typing")).toBe(false);
    expect(menuEl.classList.contains("disabled")).toBe(false);
  });
});

describe("menu closing behavior", () => {
  it("should close menu with different triggers", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    const closeTriggers = [
      { name: "tab key", action: async () => await wrapper.get("input").trigger("keydown", { key: "Tab" }) },
      { name: "escape key", action: async () => await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "Escape" })) },
      { name: "dropdown button", action: async () => await wrapper.get(".dropdown-icon").trigger("click") },
    ];

    for (const trigger of closeTriggers) {
      await openMenu(wrapper);
      expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
      await trigger.action();
      expect(wrapper.findAll("div[role='option']").length).toBe(0);
    }
  });

  it("should toggle menu when clicking input while menu is open and search is empty", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    // First click should open menu
    await wrapper.get("input").trigger("mousedown");
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    // Second click should close menu (when search is empty)
    await wrapper.get("input").trigger("mousedown");
    expect(wrapper.findAll("div[role='option']").length).toBe(0);

    // Third click should open menu again
    await wrapper.get("input").trigger("mousedown");
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should keep menu open when clicking input while typing", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    // Open menu and start typing
    await wrapper.get("input").trigger("mousedown");
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    await inputSearch(wrapper, "United");
    expect(wrapper.findAll("div[role='option']").length).toBe(2);

    // Clicking input while typing should keep menu open
    await wrapper.get("input").trigger("mousedown");
    expect(wrapper.findAll("div[role='option']").length).toBe(2);
  });
});

describe("hideSelectedOptions prop", () => {
  it("should hide selected options from menu when hideSelectedOptions is true", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, hideSelectedOptions: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length - 1);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).not.toContain(options[0]?.label);
  });

  it("should show selected options in menu when hideSelectedOptions is false", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, hideSelectedOptions: false } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).toContain(options[0]?.label);
  });

  it("should show all options when in single-select mode regardless of hideSelectedOptions", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, hideSelectedOptions: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).toContain(options[0]?.label);
  });

  it("should correctly restore hidden options when they are deselected", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, hideSelectedOptions: true } });

    // Select first option
    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    // Verify it's hidden from dropdown
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length - 1);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).not.toContain(options[0]?.label);

    // Remove the option
    await wrapper.get(".multi-value-remove").trigger("click");
    await openMenu(wrapper);

    // Verify it's back in the dropdown
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).toContain(options[0]?.label);
  });

  it("should correctly filter options when searching with hideSelectedOptions enabled", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, hideSelectedOptions: true } });

    // Select first option (France)
    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");

    // Open menu and search for "United"
    await openMenu(wrapper);
    await inputSearch(wrapper, "United");

    // Should only show United Kingdom and United States (not France)
    expect(wrapper.findAll("div[role='option']").length).toBe(2);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).toContain("United Kingdom");
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).toContain("United States");
  });
});

describe("menu positioning data attribute", () => {
  it("should have data-state-position attribute on menu element", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    const menu = wrapper.find(".menu");
    expect(menu.exists()).toBe(true);
    expect(menu.attributes("data-state-position")).toBeDefined();
  });

  it("should set data-state-position to bottom-start by default", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    const menu = wrapper.find(".menu");
    expect(menu.attributes("data-state-position")).toBe("bottom-start");
  });
});

// eslint-disable-next-line test/prefer-lowercase-title
describe("WAI-ARIA compliance keyboard behaviors", () => {
  it("should open menu when pressing up arrow on focused input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("focus");
    await wrapper.get("input").trigger("keydown", { key: "ArrowUp" });

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should open menu when pressing down arrow on focused input", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await wrapper.get("input").trigger("focus");
    await wrapper.get("input").trigger("keydown", { key: "ArrowDown" });

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should not open menu when pressing arrow keys if menu is already open", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    const initialOptionCount = wrapper.findAll("div[role='option']").length;

    await wrapper.get("input").trigger("keydown", { key: "ArrowUp" });
    await wrapper.get("input").trigger("keydown", { key: "ArrowDown" });

    expect(wrapper.findAll("div[role='option']").length).toBe(initialOptionCount);
  });

  it("should select focused option when component loses focus with selectOnBlur enabled", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, selectOnBlur: true } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[1]?.label);

    await wrapper.get("input").trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[options[1]?.value]]);
    expect(wrapper.get(".single-value").text()).toBe(options[1]?.label);
  });

  it("should not select focused option when component loses focus with selectOnBlur disabled", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, selectOnBlur: false } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[1]?.label);

    await wrapper.get("input").trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.find(".single-value").exists()).toBe(false);
  });

  it("should not select disabled option when component loses focus", async () => {
    const options = [
      { label: "France", value: "FR" },
      { label: "Spain", value: "ES", disabled: true },
      { label: "United Kingdom", value: "GB" },
    ];
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, selectOnBlur: true } });

    await openMenu(wrapper);

    // Manually set focus to the disabled option to test the behavior
    const disabledOptionIndex = options.findIndex((option) => option.disabled);
    // Access the internal focusedOption ref directly
    (wrapper.vm as any).focusedOption = disabledOptionIndex;
    await wrapper.vm.$nextTick();

    expect(wrapper.get(".focused[role='option']").text()).toBe("Spain");

    await wrapper.get("input").trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(wrapper.find(".single-value").exists()).toBe(false);
  });

  it("should navigate to first option with Page Up key", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[2]?.label);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "PageUp" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0]?.label);
  });

  it("should navigate to last option with Page Down key", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[0]?.label);

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "PageDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[options.length - 1]?.label);
  });

  it("should navigate to first available option with Page Up when first option is disabled", async () => {
    const options = [
      { label: "Spain", value: "ES", disabled: true },
      { label: "France", value: "FR" },
      { label: "United Kingdom", value: "GB" },
    ];
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe("United Kingdom");

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "PageUp" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe("France");
  });

  it("should navigate to last available option with Page Down when last option is disabled", async () => {
    const options = [
      { label: "France", value: "FR" },
      { label: "United Kingdom", value: "GB" },
      { label: "Spain", value: "ES", disabled: true },
    ];
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);

    expect(wrapper.get(".focused[role='option']").text()).toBe("France");

    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "PageDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe("United Kingdom");
  });

  it("should work with multi-select mode", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, selectOnBlur: true } });

    await openMenu(wrapper);
    await dispatchEvent(wrapper, new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(wrapper.get(".focused[role='option']").text()).toBe(options[1]?.label);

    await wrapper.get("input").trigger("blur");

    expect(wrapper.emitted("update:modelValue")).toStrictEqual([[[options[1]?.value]]]);
    expect(wrapper.get(".multi-value").text()).toBe(options[1]?.label);
  });
});

describe("exposed component methods and refs", () => {
  it("should expose inputRef for direct DOM access", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    expect(wrapper.vm.inputRef).toBeDefined();
    expect(wrapper.vm.inputRef).toBe(wrapper.get("input").element);
  });

  it("should expose containerRef for direct DOM access", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    expect(wrapper.vm.containerRef).toBeDefined();
    expect(wrapper.vm.containerRef).toBe(wrapper.get(".vue-select").element);
  });

  it("should expose openMenu method", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    expect(typeof wrapper.vm.openMenu).toBe("function");
    expect(wrapper.findAll("div[role='option']").length).toBe(0);

    wrapper.vm.openMenu();
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should expose closeMenu method", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    await openMenu(wrapper);
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    wrapper.vm.closeMenu();
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should expose toggleMenu method", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options } });

    expect(typeof wrapper.vm.toggleMenu).toBe("function");
    expect(wrapper.findAll("div[role='option']").length).toBe(0);

    wrapper.vm.toggleMenu();
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);

    wrapper.vm.toggleMenu();
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll("div[role='option']").length).toBe(0);
  });

  it("should expose clear method for single select", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: options[0]?.value, options } });

    expect(typeof wrapper.vm.clear).toBe("function");
    expect(wrapper.get(".single-value").text()).toBe(options[0]?.label);

    wrapper.vm.clear();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update:modelValue")).toContainEqual([undefined]);
  });

  it("should expose clear method for multi select", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [options[0]?.value], isMulti: true, options } });

    expect(typeof wrapper.vm.clear).toBe("function");
    expect(wrapper.find(".multi-value").exists()).toBe(true);

    wrapper.vm.clear();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("update:modelValue")).toContainEqual([[]]);
  });

  it("should render menu-header slot only once before options", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: null, options },
      slots: {
        "menu-header": () => h("div", { class: "test-menu-header" }, "Menu Header"),
      },
    });

    await openMenu(wrapper);

    // Should have exactly one menu header
    const menuHeaders = wrapper.findAll(".test-menu-header");
    expect(menuHeaders.length).toBe(1);

    // Should have the same number of options as provided
    const menuOptions = wrapper.findAll("div[role='option']");
    expect(menuOptions.length).toBe(options.length);

    // Menu header should appear before all options in the DOM
    const menu = wrapper.find(".menu");
    const menuContent = menu.element.innerHTML;
    const headerIndex = menuContent.indexOf("test-menu-header");
    const firstOptionIndex = menuContent.indexOf("role=\"option\"");

    expect(headerIndex).toBeGreaterThan(-1);
    expect(firstOptionIndex).toBeGreaterThan(-1);
    expect(headerIndex).toBeLessThan(firstOptionIndex);
  });
});
