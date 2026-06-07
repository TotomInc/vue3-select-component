let optionIdCount = 0;

export function createOptionId(): string {
  return `select-option-${++optionIdCount}`;
}
