import { afterEach, describe, expect, it } from "vitest";
import { effectScope, ref } from "vue";

import { useSelectDismiss } from "./useSelectDismiss";

describe("useSelectDismiss", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("closes when clicking outside registered dismiss targets", () => {
    const isOpen = ref(true);
    const scope = effectScope();

    scope.run(() => {
      const dismiss = useSelectDismiss({
        isOpen,
        close: () => {
          isOpen.value = false;
        },
      });

      const root = document.createElement("div");
      const trigger = document.createElement("button");
      const popover = document.createElement("div");
      const outside = document.createElement("button");

      root.append(trigger);
      document.body.append(root, outside);

      dismiss.registerRootElement(root);
      dismiss.registerTriggerElement(trigger);
      dismiss.registerPopoverElement(popover);

      outside.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(isOpen.value).toBe(false);
    });

    scope.stop();
  });

  it("closes when focus moves outside registered dismiss targets", () => {
    const isOpen = ref(true);
    const scope = effectScope();

    scope.run(() => {
      const dismiss = useSelectDismiss({
        isOpen,
        close: () => {
          isOpen.value = false;
        },
      });

      const root = document.createElement("div");
      const trigger = document.createElement("button");
      const popover = document.createElement("div");
      const outside = document.createElement("button");

      root.append(trigger);
      document.body.append(root, popover, outside);

      dismiss.registerRootElement(root);
      dismiss.registerTriggerElement(trigger);
      dismiss.registerPopoverElement(popover);

      outside.focus();

      expect(isOpen.value).toBe(false);
    });

    scope.stop();
  });

  it("ignores focus moves inside the trigger, root, or popover", () => {
    const isOpen = ref(true);
    const scope = effectScope();

    scope.run(() => {
      const dismiss = useSelectDismiss({
        isOpen,
        close: () => {
          isOpen.value = false;
        },
      });

      const root = document.createElement("div");
      const trigger = document.createElement("button");
      const popover = document.createElement("div");
      const clear = document.createElement("button");

      trigger.append(clear);
      root.append(trigger, popover);
      document.body.append(root);

      dismiss.registerRootElement(root);
      dismiss.registerTriggerElement(trigger);
      dismiss.registerPopoverElement(popover);

      trigger.focus();
      clear.focus();

      expect(isOpen.value).toBe(true);
    });

    scope.stop();
  });

  it("ignores clicks inside the trigger, root, or popover", () => {
    const isOpen = ref(true);
    const scope = effectScope();

    scope.run(() => {
      const dismiss = useSelectDismiss({
        isOpen,
        close: () => {
          isOpen.value = false;
        },
      });

      const root = document.createElement("div");
      const trigger = document.createElement("button");
      const popover = document.createElement("div");

      root.append(trigger, popover);
      document.body.append(root);

      dismiss.registerRootElement(root);
      dismiss.registerTriggerElement(trigger);
      dismiss.registerPopoverElement(popover);

      trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(isOpen.value).toBe(true);

      popover.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      expect(isOpen.value).toBe(true);
    });

    scope.stop();
  });

  it("ignores detached option nodes selected during the same click", () => {
    const isOpen = ref(true);
    const scope = effectScope();

    scope.run(() => {
      const dismiss = useSelectDismiss({
        isOpen,
        close: () => {
          isOpen.value = false;
        },
      });

      const option = document.createElement("div");
      option.setAttribute("role", "option");

      dismiss.registerRootElement(document.createElement("div"));

      option.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(isOpen.value).toBe(true);
    });

    scope.stop();
  });

  it("stops listening when the menu closes", () => {
    const isOpen = ref(true);
    const scope = effectScope();

    scope.run(() => {
      const dismiss = useSelectDismiss({
        isOpen,
        close: () => {
          isOpen.value = false;
        },
      });

      const outside = document.createElement("button");
      document.body.append(outside);

      dismiss.registerRootElement(document.createElement("div"));

      isOpen.value = false;
      outside.dispatchEvent(new MouseEvent("click", { bubbles: true }));

      expect(isOpen.value).toBe(false);
    });

    scope.stop();
  });
});
