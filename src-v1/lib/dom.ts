import type { ComponentPublicInstance } from "vue";

export function resolveHTMLElement(node: Element | ComponentPublicInstance | null): HTMLElement | null {
  if (node instanceof HTMLElement) {
    return node;
  }

  if (node && "$el" in node && node.$el instanceof HTMLElement) {
    return node.$el;
  }

  return null;
}
