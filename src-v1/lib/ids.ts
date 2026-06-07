let optionIdCount = 0;

export function createOptionId(): string {
  return `select-option-${++optionIdCount}`;
}

export function createPropOptionId(value: string | number): string {
  return `prop:${String(value)}`;
}
