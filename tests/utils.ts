import type { mount } from "@vue/test-utils";

export async function openMenu(wrapper: ReturnType<typeof mount>, method: "mousedown" | "focus-space" | "single-value" = "mousedown") {
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

export async function dispatchEvent(wrapper: ReturnType<typeof mount>, event: Event) {
  document.dispatchEvent(event);
  await wrapper.vm.$nextTick();
};

export async function inputSearch(wrapper: ReturnType<typeof mount>, search: string) {
  await wrapper.get("input").setValue(search);
}
