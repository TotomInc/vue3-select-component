import type { SelectModelValue, SelectOptionData } from "./index";

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  Select,
  SelectOption,
  SelectRoot,
} from "./index";

import packageJson from "./package.json";

const packageRoot = dirname(fileURLToPath(import.meta.url));

describe("src internal exports", () => {
  it("exports the assembled Select and primitive components", () => {
    expect(Select).toBeTruthy();
    expect(SelectRoot).toBeTruthy();
    expect(SelectOption).toBeTruthy();
  });

  it("ships minified styles in dist for npm subpath exports", () => {
    const stylesPath = resolve(packageRoot, "dist/styles.css");

    expect(existsSync(stylesPath)).toBe(true);

    const styles = readFileSync(stylesPath, "utf8");

    expect(styles).toContain("[data-assembled-select]");
    expect(styles).toContain("--vs-padding-x");

    expect(packageJson.exports["./styles"]).toMatchObject({
      style: "./dist/styles.css",
      default: "./dist/styles.css",
    });
    expect(packageJson.exports["./styles.css"]).toBe("./dist/styles.css");
  });

  it("exports v1 option and model types", () => {
    const option: SelectOptionData<string> = {
      label: "TypeScript",
      value: "ts",
    };

    const model: SelectModelValue<string> = option.value;

    expect(option.label).toBe("TypeScript");
    expect(model).toBe("ts");
  });
});
