import type { Ref } from "vue";

import { onScopeDispose, shallowRef, watch } from "vue";

type UseSelectDismissParams = {
  isOpen: Ref<boolean>;
  close: () => void;
};

function isOptionElement(target: EventTarget | null) {
  return target instanceof HTMLElement && target.getAttribute("role") === "option";
}

function isNodeInsideElements(node: Node, elements: readonly (HTMLElement | null)[]) {
  return elements.some((element) => element?.contains(node));
}

export function useSelectDismiss(params: UseSelectDismissParams) {
  const rootElement = shallowRef<HTMLElement | null>(null);
  const triggerElement = shallowRef<HTMLElement | null>(null);
  const popoverElement = shallowRef<HTMLElement | null>(null);

  const registerRootElement = (element: HTMLElement | null) => {
    rootElement.value = element;
  };

  const registerTriggerElement = (element: HTMLElement | null) => {
    triggerElement.value = element;
  };

  const registerPopoverElement = (element: HTMLElement | null) => {
    popoverElement.value = element;
  };

  const dismissTargets = () => [rootElement.value, triggerElement.value, popoverElement.value];

  const handleDocumentClick = (event: MouseEvent) => {
    if (!params.isOpen.value) {
      return;
    }

    const { target } = event;

    if (!(target instanceof Node)) {
      return;
    }

    if (isNodeInsideElements(target, dismissTargets())) {
      return;
    }

    // Single-select closes before the document listener runs; the option node may
    // already be gone from the DOM when this handler evaluates the click target.
    if (isOptionElement(target)) {
      return;
    }

    params.close();
  };

  let isListening = false;

  const startListening = () => {
    if (isListening) {
      return;
    }

    document.addEventListener("click", handleDocumentClick);
    isListening = true;
  };

  const stopListening = () => {
    if (!isListening) {
      return;
    }

    document.removeEventListener("click", handleDocumentClick);
    isListening = false;
  };

  watch(
    () => params.isOpen.value,
    (open) => {
      if (open) {
        startListening();
        return;
      }

      stopListening();
    },
    { flush: "sync", immediate: true },
  );

  onScopeDispose(stopListening);

  return {
    registerRootElement,
    registerTriggerElement,
    registerPopoverElement,
    rootElement,
    triggerElement,
    popoverElement,
  };
}
