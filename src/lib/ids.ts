let optionIdCount = 0;
let instanceIdCount = 0;

export function createSelectInstanceId(): string {
  return `v1-select-${++instanceIdCount}`;
}

export function createOptionId(): string {
  return `select-option-${++optionIdCount}`;
}

export function createPropOptionId(value: string | number): string {
  return `prop:${String(value)}`;
}
