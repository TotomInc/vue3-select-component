import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { h } from "vue";
import VueSelect from "../src/Select.vue";
import { dispatchEvent, inputSearch, openMenu } from "./utils";

const options = [
  { label: "France", value: "FR" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "Germany", value: "DE" },
];

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

describe("hideSelectedOptions prop", () => {
  it("should hide selected options from menu when hideSelectedOptions is true", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, hideSelectedOptions: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length - 1);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).not.toContain(options[0].label);
  });

  it("should show selected options in menu when hideSelectedOptions is false", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, hideSelectedOptions: false } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).toContain(options[0].label);
  });

  it("should show all options when in single-select mode regardless of hideSelectedOptions", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: null, options, hideSelectedOptions: true } });

    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).toContain(options[0].label);
  });

  it("should correctly restore hidden options when they are deselected", async () => {
    const wrapper = mount(VueSelect, { props: { modelValue: [], isMulti: true, options, hideSelectedOptions: true } });

    // Select first option
    await openMenu(wrapper);
    await wrapper.get("div[role='option']").trigger("click");
    await openMenu(wrapper);

    // Verify it's hidden from dropdown
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length - 1);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).not.toContain(options[0].label);

    // Remove the option
    await wrapper.get(".multi-value-remove").trigger("click");
    await openMenu(wrapper);

    // Verify it's back in the dropdown
    expect(wrapper.findAll("div[role='option']").length).toBe(options.length);
    expect(wrapper.findAll("div[role='option']").map((option) => option.text())).toContain(options[0].label);
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
      expect(wrapper.get(".focused[role='option']").text()).toBe(options[0].label);
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

describe("menu-container slot", () => {
  it("should render custom container while preserving default content", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: null, options },
      slots: {
        "menu-container": ({ defaultContent }) => (
          h("div", { class: "custom-container" }, [defaultContent])
        ),
      },
    });

    await openMenu(wrapper);

    // Verify custom container is rendered
    expect(wrapper.find(".custom-container").exists()).toBe(true);

    // Verify default content is preserved inside custom container
    const customContainer = wrapper.get(".custom-container");
    expect(customContainer.findAll("div[role='option']").length).toBe(options.length);
  });

  it("should maintain menu functionality when using custom container", async () => {
    const wrapper = mount(VueSelect, {
      props: { modelValue: null, options },
      slots: {
        "menu-container": ({ defaultContent }) => (
          h("div", { class: "custom-container" }, [defaultContent])
        ),
      },
    });

    await openMenu(wrapper);

    // Test option selection still works
    await wrapper.get("div[role='option']").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([options[0].value]);

    // Test search filtering still works
    await openMenu(wrapper);
    await inputSearch(wrapper, "United");

    const customContainer = wrapper.get(".custom-container");
    expect(customContainer.findAll("div[role='option']").length).toBe(2);
    expect(customContainer.findAll("div[role='option']").map((option) => option.text()))
      .toEqual(expect.arrayContaining(["United Kingdom", "United States"]));
  });
});
