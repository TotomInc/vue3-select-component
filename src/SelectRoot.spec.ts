import type { SelectModelValue } from "./types/model";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";

import SelectClear from "./primitives/SelectClear.vue";
import SelectInput from "./primitives/SelectInput.vue";
import SelectListbox from "./primitives/SelectListbox.vue";
import SelectNoOptions from "./primitives/SelectNoOptions.vue";
import SelectOption from "./primitives/SelectOption.vue";
import SelectPopover from "./primitives/SelectPopover.vue";
import SelectRoot from "./primitives/SelectRoot.vue";
import SelectTag from "./primitives/SelectTag.vue";
import SelectTrailingIcon from "./primitives/SelectTrailingIcon.vue";
import SelectTrigger from "./primitives/SelectTrigger.vue";
import SelectValue from "./primitives/SelectValue.vue";
import {
  basicOptions,
  mountPrimitiveSelect,
  optionsWithDisabled,
} from "./test-utils/mount-primitive-select";

describe("v1 SelectRoot foundation", () => {
  it("renders the root shell and provides context to child primitives", () => {
    const { wrapper } = mountPrimitiveSelect();

    expect(wrapper.find("[data-select-root]").exists()).toBe(true);
    expect(wrapper.find("[data-select-trigger]").exists()).toBe(true);
    expect(wrapper.get("[data-select-value]").text()).toBe("Pick a language");
  });

  it("closes the menu when clicking outside the select", async () => {
    const { wrapper } = mountPrimitiveSelect();
    const outside = document.createElement("button");

    document.body.append(outside);

    await wrapper.get("[data-select-trigger]").trigger("click");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("false");

    outside.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");

    outside.remove();
  });

  it("closes a teleported menu when clicking outside", async () => {
    const teleportTarget = document.createElement("div");
    teleportTarget.id = "v1-dismiss-teleport-target";
    document.body.append(teleportTarget);

    const outside = document.createElement("button");
    document.body.append(outside);

    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
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

    await wrapper.get("[data-select-trigger]").trigger("click");

    const teleportedPopover = teleportTarget.querySelector("[data-select-popover]");
    expect(teleportedPopover?.getAttribute("aria-hidden")).toBe("false");

    outside.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(teleportedPopover?.getAttribute("aria-hidden")).toBe("true");

    outside.remove();
    teleportTarget.remove();
  });

  it("toggles menu open state from the trigger", async () => {
    const { wrapper } = mountPrimitiveSelect();

    const trigger = wrapper.get("[data-select-trigger]");

    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");

    await trigger.trigger("click");

    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("false");
    expect(wrapper.findAll("[data-select-option]")).toHaveLength(2);
  });

  it("closes the menu when clicking the trigger again without reopening", async () => {
    const { wrapper } = mountPrimitiveSelect();
    const trigger = wrapper.get("[data-select-trigger]");

    await trigger.trigger("click");
    expect(trigger.attributes("aria-expanded")).toBe("true");

    await trigger.trigger("click");

    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");
  });

  it("updates v-model on single selection and closes the menu", async () => {
    const { wrapper, model } = mountPrimitiveSelect();

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option][data-value='ts']").trigger("click");

    expect(model.value).toBe("ts");
    expect(wrapper.get("[data-select-value]").text()).toBe("TypeScript");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");
  });

  it("registers declarative options in the collection", async () => {
    const { wrapper } = mountPrimitiveSelect();

    await wrapper.get("[data-select-trigger]").trigger("click");

    expect(wrapper.find("[data-select-no-options]").exists()).toBe(false);
    expect(wrapper.findAll("[role='option']")).toHaveLength(2);
  });

  it("clears the model when clearable is enabled", async () => {
    const { wrapper, model } = mountPrimitiveSelect({ modelValue: "js", clearable: true });

    expect(wrapper.find("[data-select-clear]").exists()).toBe(true);

    await wrapper.get("[data-select-clear]").trigger("click");

    expect(model.value).toBeNull();
    expect(wrapper.get("[data-select-value]").text()).toBe("Pick a language");
  });

  it("renders custom clear button content from the SelectClear default slot", () => {
    const model = ref<SelectModelValue<string>>("js");

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": "js",
        "clearable": true,
        "options": [...basicOptions],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
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

    expect(wrapper.get("[data-select-clear]").text()).toBe("Reset");
    expect(wrapper.find("[data-select-clear] svg").exists()).toBe(false);
  });

  it("throws when a primitive is used outside SelectRoot", () => {
    const OrphanTrigger = defineComponent({
      render: () => h(SelectTrigger),
    });

    expect(() => mount(OrphanTrigger)).toThrow("injectSelectContext must be used within SelectRoot");
  });
});

describe("v1 SelectRoot core module", () => {
  it("supports multi-select toggling without closing the menu", async () => {
    const { wrapper, model } = mountPrimitiveSelect({ multiple: true });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option][data-value='js']").trigger("click");
    await wrapper.get("[data-select-option][data-value='ts']").trigger("click");

    expect(model.value).toEqual(["js", "ts"]);
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("false");

    await wrapper.get("[data-select-option][data-value='js']").trigger("click");

    expect(model.value).toEqual(["ts"]);
  });

  it("shows a checkmark on selected options in multi-select mode", async () => {
    const { wrapper } = mountPrimitiveSelect({ multiple: true });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option][data-value='js']").trigger("click");

    const selectedOption = wrapper.get("[data-select-option][data-value='js']");
    const unselectedOption = wrapper.get("[data-select-option][data-value='ts']");

    expect(selectedOption.find("[data-select-option-checkmark] svg").exists()).toBe(true);
    expect(unselectedOption.find("[data-select-option-checkmark]").exists()).toBe(false);
  });

  it("hides selected options from the dropdown when hideSelected is enabled", async () => {
    const { wrapper } = mountPrimitiveSelect({
      multiple: true,
      hideSelected: true,
      modelValue: ["js"],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");

    expect(wrapper.find("[data-select-option][data-value='js']").exists()).toBe(false);
    expect(wrapper.find("[data-select-option][data-value='ts']").exists()).toBe(true);
  });

  it("navigates with arrow keys and skips disabled options", async () => {
    const { wrapper } = mountPrimitiveSelect({ selectOptions: optionsWithDisabled });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "ArrowDown" });

    expect(wrapper.get("[data-select-option][data-active='true']").attributes("data-value")).toBe("ts");

    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "ArrowUp" });

    expect(wrapper.get("[data-select-option][data-active='true']").attributes("data-value")).toBe("js");
  });

  it("selects the active option on Enter", async () => {
    const { wrapper, model } = mountPrimitiveSelect();

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "ArrowDown" });
    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "Enter" });

    expect(model.value).toBe("ts");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");
  });

  it("opens the menu from the trigger with ArrowDown", async () => {
    const { wrapper } = mountPrimitiveSelect();

    await wrapper.get("[data-select-trigger]").trigger("keydown", { key: "ArrowDown" });

    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("false");
  });

  it("filters options and keeps the active option in the filtered set", async () => {
    const { wrapper } = mountPrimitiveSelect({ searchable: true });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-input]").setValue("type");
    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "ArrowDown" });

    expect(wrapper.findAll("[data-select-option]")).toHaveLength(1);
    expect(wrapper.get("[data-select-option]").attributes("data-value")).toBe("ts");
    expect(wrapper.get("[data-select-option][data-active='true']").attributes("data-value")).toBe("ts");
  });

  it("shows the empty state when filtering removes every option", async () => {
    const { wrapper } = mountPrimitiveSelect({ searchable: true });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-input]").setValue("zzzz");

    expect(wrapper.find("[data-select-no-options]").exists()).toBe(true);
    expect(wrapper.findAll("[data-select-option]")).toHaveLength(0);
  });

  it("passes searchValue to the SelectNoOptions default slot", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "options": [...basicOptions],
        "searchable": true,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectInput),
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

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-input]").setValue("zzzz");

    expect(wrapper.get("[data-select-no-options]").text()).toBe("No match for \"zzzz\"");
  });

  it("resolves options from the options prop without declarative duplicates", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "options": [...optionsWithDisabled],
        "searchable": true,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectValue, { placeholder: "Pick a language" }),
          }),
          h(SelectPopover, { teleport: false }, {
            default: () => [
              h(SelectInput),
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

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-input]").setValue("type");

    expect(wrapper.findAll("[data-select-option]")).toHaveLength(1);
    expect(wrapper.get("[data-select-option]").attributes("data-value")).toBe("ts");
  });

  it("removes the last selected value on Backspace in multi-select mode", async () => {
    const { wrapper, model } = mountPrimitiveSelect({
      multiple: true,
      modelValue: ["js", "ts"],
    });

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "Backspace" });

    expect(model.value).toEqual(["js"]);
  });
});

describe("v1 primitive composition", () => {
  it("renders multi-select tags and removes a value from the tag button", async () => {
    const { wrapper, model } = mountPrimitiveSelect({
      multiple: true,
      modelValue: ["js", "ts"],
      usePropOptions: true,
    });

    await wrapper.vm.$nextTick();

    const tags = wrapper.findAll("[data-select-tag]");
    expect(tags).toHaveLength(2);
    expect(tags[0]?.text()).toContain("JavaScript");
    expect(tags[1]?.text()).toContain("TypeScript");

    await wrapper.get("[data-select-tag-remove]").trigger("click");

    expect(model.value).toEqual(["ts"]);
    expect(wrapper.findAll("[data-select-tag]")).toHaveLength(1);
  });

  it("exposes loading state on the trailing icon primitive", () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "loading": true,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectTrailingIcon),
          }),
        ],
      },
    });

    expect(wrapper.get("[data-select-trailing-icon]").attributes("data-loading")).toBe("true");
  });

  it("renders a default chevron in the trailing icon primitive", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectTrailingIcon),
          }),
        ],
      },
    });

    const trailingIcon = wrapper.get("[data-select-trailing-icon]");

    expect(trailingIcon.find("svg").exists()).toBe(true);
    expect(trailingIcon.attributes("data-open")).toBe("false");

    await wrapper.get("[data-select-trigger]").trigger("click");

    expect(trailingIcon.attributes("data-open")).toBe("true");
  });

  it("renders a default remove icon in SelectTag", () => {
    const model = ref<SelectModelValue<string>>(["js"]);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": ["js"],
        "multiple": true,
        "options": [...basicOptions],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectTag, { value: "js", label: "JavaScript" }),
          }),
        ],
      },
    });

    expect(wrapper.find("[data-select-tag-remove] svg").exists()).toBe(true);
  });

  it("forwards a custom remove icon from SelectValue tag-remove slot", () => {
    const model = ref<SelectModelValue<string>>(["js"]);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": ["js"],
        "multiple": true,
        "options": [...basicOptions],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
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

    expect(wrapper.get("[data-select-tag-remove]").text()).toBe("Remove JavaScript");
    expect(wrapper.find("[data-select-tag-remove] svg").exists()).toBe(false);
  });

  it("defaults closeOnSelect to null for auto mode behavior", () => {
    const { wrapper } = mountPrimitiveSelect();

    expect(wrapper.props("closeOnSelect")).toBeNull();
  });

  it("keeps the menu open on single-select when closeOnSelect is false", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "closeOnSelect": false,
        "options": [...basicOptions],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
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

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option][data-value='js']").trigger("click");

    expect(model.value).toBe("js");
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("false");
  });

  it("closes the menu on multi-select when closeOnSelect is enabled", async () => {
    const model = ref<SelectModelValue<string>>([]);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": [],
        "multiple": true,
        "closeOnSelect": true,
        "options": [...basicOptions],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
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

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-option][data-value='js']").trigger("click");

    expect(model.value).toEqual(["js"]);
    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("true");
  });

  it("wires trigger and listbox ids for aria-activedescendant", async () => {
    const { wrapper } = mountPrimitiveSelect();

    await wrapper.get("[data-select-trigger]").trigger("click");
    await wrapper.get("[data-select-listbox]").trigger("keydown", { key: "ArrowDown" });

    const trigger = wrapper.get("[data-select-trigger]");
    const activeOption = wrapper.get("[data-select-option][data-active='true']");

    expect(trigger.attributes("aria-controls")).toBe(wrapper.get("[data-select-listbox]").attributes("id"));
    expect(trigger.attributes("aria-activedescendant")).toBe(activeOption.attributes("id"));
  });

  it("teleports the popover to body by default", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
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

    await wrapper.get("[data-select-trigger]").trigger("click");

    const teleportedPopover = document.body.querySelector("[data-select-popover]");

    expect(teleportedPopover).not.toBeNull();
    expect(teleportedPopover?.getAttribute("aria-hidden")).toBe("false");
    expect(wrapper.find("[data-select-popover]").exists()).toBe(false);

    wrapper.unmount();
    teleportedPopover?.remove();
  });

  it("renders the popover inline when teleport is false", async () => {
    const { wrapper } = mountPrimitiveSelect();

    await wrapper.get("[data-select-trigger]").trigger("click");

    expect(wrapper.get("[data-select-popover]").attributes("aria-hidden")).toBe("false");
    expect(document.body.querySelector("[data-select-popover]")).toBeNull();
  });

  it("teleports the popover to a custom target when a selector is provided", async () => {
    const teleportTarget = document.createElement("div");
    teleportTarget.id = "v1-teleport-target";
    document.body.appendChild(teleportTarget);

    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
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

    await wrapper.get("[data-select-trigger]").trigger("click");

    const teleportedPopover = teleportTarget.querySelector("[data-select-popover]");

    expect(teleportedPopover).not.toBeNull();
    expect(teleportedPopover?.getAttribute("aria-hidden")).toBe("false");
    expect(wrapper.find("[data-select-popover]").exists()).toBe(false);

    teleportTarget.remove();
  });

  it("forwards reka-ui popover content props to SelectPopover", async () => {
    const model = ref<SelectModelValue<string>>(null);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": null,
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
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
            modal: true,
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

    const popover = wrapper.getComponent(SelectPopover);

    expect(popover.props("side")).toBe("top");
    expect(popover.props("align")).toBe("end");
    expect(popover.props("sideOffset")).toBe(12);
    expect(popover.props("modal")).toBe(true);
  });

  it("renders a standalone SelectTag when composed manually", async () => {
    const model = ref<SelectModelValue<string>>(["js"]);

    const wrapper = mount(SelectRoot<string>, {
      props: {
        "modelValue": ["js"],
        "multiple": true,
        "options": [...basicOptions],
        "onUpdate:modelValue": (value: SelectModelValue<string>) => {
          model.value = value;
          wrapper.setProps({ modelValue: value });
        },
      },
      slots: {
        default: () => [
          h(SelectTrigger, null, {
            default: () => h(SelectTag, { value: "js", label: "JavaScript" }),
          }),
        ],
      },
    });

    await wrapper.get("[data-select-tag-remove]").trigger("click");

    expect(model.value).toEqual([]);
  });
});
