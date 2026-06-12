import type { VueWrapper } from "@vue/test-utils";

import SelectInput from "../primitives/SelectInput.vue";
import SelectListbox from "../primitives/SelectListbox.vue";
import SelectOption from "../primitives/SelectOption.vue";
import SelectPopover from "../primitives/SelectPopover.vue";

/**
 * Returns the teleported popover element when teleport is enabled.
 */
export function getTeleportedPopoverElement() {
  return document.body.querySelector<HTMLElement>("[data-select-popover]");
}

/**
 * Reads the popover open state from the rendered DOM.
 */
export function getPopoverAriaHidden(wrapper: VueWrapper) {
  const inlinePopover = wrapper.find("[data-select-popover]");

  if (inlinePopover.exists()) {
    return inlinePopover.attributes("aria-hidden");
  }

  return getTeleportedPopoverElement()?.getAttribute("aria-hidden") ?? null;
}

/**
 * Removes teleported select nodes left in `document.body` after a test.
 */
export function cleanupTeleportedSelectContent() {
  document.body.querySelectorAll("[data-select-popover]").forEach((element) => {
    element.remove();
  });
}

/**
 * Helpers for interacting with assembled Select content teleported outside the wrapper.
 * Vue Test Utils can still resolve child components through the virtual DOM.
 */
export function createAssembledSelectHelpers(wrapper: VueWrapper) {
  return {
    getListbox: () => wrapper.getComponent(SelectListbox),
    getInput: () => wrapper.getComponent(SelectInput),
    getPopoverComponent: () => wrapper.getComponent(SelectPopover),
    findOptions: () => wrapper.findAllComponents(SelectOption),
    findVisibleOptions: () => wrapper
      .findAllComponents(SelectOption)
      .filter(option => option.isVisible()),
    getPopoverAriaHidden: () => getPopoverAriaHidden(wrapper),
    getTeleportedPopoverElement,
    async openMenu() {
      await wrapper.get("[data-select-trigger]").trigger("click");
    },
  };
}
