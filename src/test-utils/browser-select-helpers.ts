import type { RenderResult } from "vitest-browser-vue";
import type { Locator } from "vitest/browser";

import { page } from "vitest/browser";

/**
 * Returns a locator for an element matching a selector inside the rendered container.
 */
export function locateInContainer(container: ParentNode, selector: string): Locator {
  const element = container.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new TypeError(`Expected to find ${selector}`);
  }

  return page.elementLocator(element);
}

/**
 * Returns a locator for an element matching a selector anywhere in the document.
 */
export function locateInDocument(selector: string): Locator {
  const element = document.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new TypeError(`Expected to find ${selector}`);
  }

  return page.elementLocator(element);
}

/**
 * Returns the teleported popover element when teleport is enabled.
 */
export function getTeleportedPopoverElement() {
  return document.body.querySelector<HTMLElement>("[data-select-popover]");
}

/**
 * Reads the popover open state from the rendered DOM.
 */
export function getPopoverAriaHidden(container?: ParentNode) {
  if (container) {
    const scopedPopover = container.querySelector<HTMLElement>("[data-select-popover]");

    if (scopedPopover) {
      return scopedPopover.getAttribute("aria-hidden");
    }
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
 * Returns rendered option elements from the open popover.
 */
export function findRenderedOptionElements() {
  const popover = getTeleportedPopoverElement()
    ?? document.querySelector<HTMLElement>("[data-select-popover]");

  if (!popover) {
    return [];
  }

  return Array.from(popover.querySelectorAll<HTMLElement>("[data-select-option]"));
}

/**
 * Dispatches a keyboard event on a locator or DOM element.
 */
export async function dispatchKeydown(
  target: Locator | HTMLElement,
  key: string,
  init: KeyboardEventInit = {},
) {
  const element = "element" in target ? target.element() : target;

  element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...init }));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Waits for focus-driven dismiss handlers to run.
 */
export async function flushFocusUpdates() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export function queryHTMLElement(container: ParentNode, selector: string) {
  const element = container.querySelector(selector);

  return element instanceof HTMLElement ? element : null;
}

export type BrowserSelectScreen = RenderResult<Record<string, unknown>> & {
  container: HTMLElement;
};

export function createContainerQueries(screen: BrowserSelectScreen) {
  return {
    trigger: () => locateInContainer(screen.container, "[data-select-trigger]"),
    value: () => locateInContainer(screen.container, "[data-select-value]"),
    input: () => locateInContainer(screen.container, "[data-select-input]"),
    clear: () => locateInContainer(screen.container, "[data-select-clear]"),
    listbox: () => locateInDocument("[data-select-listbox]"),
    popover: () => locateInContainer(screen.container, "[data-select-popover]"),
  };
}
