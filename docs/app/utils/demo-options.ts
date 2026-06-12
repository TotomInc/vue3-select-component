export const simpleOptions = [
  { label: "Option #1", value: "option_1" },
  { label: "Option #2", value: "option_2" },
  { label: "Option #3", value: "option_3" },
];

export const countryOptions = [
  { label: "France", value: "FR" },
  { label: "Spain", value: "ES" },
  { label: "United Kingdom", value: "GB" },
  { label: "Germany", value: "DE" },
  { label: "Italy", value: "IT" },
];

export const countryOptionsWithDisabled = [
  { label: "France", value: "FR" },
  { label: "Spain", value: "ES", disabled: true },
  { label: "United Kingdom", value: "GB" },
  { label: "Germany", value: "DE" },
];

export const languageOptions = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
  { label: "Rust", value: "rs" },
];

export type LanguageOptionWithMeta = {
  label: string;
  value: string;
  description: string;
};

export const languageOptionsWithMeta: LanguageOptionWithMeta[] = [
  { label: "JavaScript", value: "js", description: "Runs in browsers and Node.js" },
  { label: "TypeScript", value: "ts", description: "Typed superset of JavaScript" },
  { label: "Python", value: "py", description: "General-purpose scripting" },
  { label: "Rust", value: "rs", description: "Systems programming with ownership" },
];

export type CountryRecord = {
  name: string;
  code: string;
  region: string;
};

export const countryRecords: CountryRecord[] = [
  { name: "France", code: "FR", region: "Europe" },
  { name: "Japan", code: "JP", region: "Asia" },
  { name: "Brazil", code: "BR", region: "South America" },
  { name: "Canada", code: "CA", region: "North America" },
];
