let optionIdCount = 0;
let instanceIdCount = 0;
let groupIdCount = 0;
let groupLabelIdCount = 0;

export function createSelectInstanceId(): string {
  return `v1-select-${++instanceIdCount}`;
}

export function createOptionId(): string {
  return `select-option-${++optionIdCount}`;
}

export function createGroupId(): string {
  return `select-group-${++groupIdCount}`;
}

export function createGroupLabelId(): string {
  return `select-group-label-${++groupLabelIdCount}`;
}

export function createPropOptionId(value: string | number): string {
  return `prop:${String(value)}`;
}
