import type { SelectModelValue } from "@v1/types/model";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";

import SelectListbox from "./SelectListbox.vue";
import SelectOption from "./SelectOption.vue";
import SelectPopover from "./SelectPopover.vue";
import SelectRoot from "./SelectRoot.vue";
import SelectTrigger from "./SelectTrigger.vue";

describe("SelectOption registration", () => {
  it("registers on mount and unregisters on unmount with a stable id", async () => {
    const showTypeScript = ref(true);

    const DynamicOptions = defineComponent({
      setup() {
        return () =>
          h(SelectRoot<string>, {
            modelValue: null,
            "onUpdate:modelValue": () => {},
          }, {
            default: () => [
              h(SelectTrigger),
              h(SelectPopover, null, {
                default: () =>
                  h(SelectListbox, null, {
                    default: () => [
                      h(SelectOption, { value: "js", label: "JavaScript" }),
                      showTypeScript.value
                        ? h(SelectOption, { value: "ts", label: "TypeScript" })
                        : null,
                    ],
                  }),
              }),
            ],
          });
      },
    });

    const wrapper = mount(DynamicOptions);

    await wrapper.get("[data-v1-select-trigger]").trigger("click");

    const typeScriptOption = wrapper.get("[data-v1-select-option][data-value='ts']");
    const stableOptionId = typeScriptOption.attributes("id");

    expect(stableOptionId).toBeTruthy();
    expect(wrapper.findAll("[data-v1-select-option]")).toHaveLength(2);

    showTypeScript.value = false;
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll("[data-v1-select-option]")).toHaveLength(1);
    expect(wrapper.find("[data-v1-select-option][data-value='ts']").exists()).toBe(false);

    showTypeScript.value = true;
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const remountedOption = wrapper.get("[data-v1-select-option][data-value='ts']");
    expect(remountedOption.attributes("id")).not.toBe(stableOptionId);
  });

  it("does not select a disabled option on click", async () => {
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
          h(SelectTrigger),
          h(SelectPopover, null, {
            default: () =>
              h(SelectListbox, null, {
                default: () =>
                  h(SelectOption, {
                    value: "es",
                    label: "Spain",
                    disabled: true,
                  }),
              }),
          }),
        ],
      },
    });

    await wrapper.get("[data-v1-select-trigger]").trigger("click");
    await wrapper.get("[data-v1-select-option]").trigger("click");

    expect(model.value).toBeNull();
  });
});
