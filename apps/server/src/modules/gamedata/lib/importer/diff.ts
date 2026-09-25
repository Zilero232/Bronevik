import type { CollectChangesInput, DiffInput, SpecChange, SpecPrimitive } from './importer.types';

import { DIFF_KEYS } from './importer.constants';

const isPrimitive = (value: unknown): value is SpecPrimitive =>
  value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const keyOf = (item: unknown, index: number): string => {
  if (isRecord(item)) {
    const key = DIFF_KEYS.find((candidate) => typeof item[candidate] === 'string');

    if (key) {
      return String(item[key]);
    }
  }

  return String(index);
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.map((item, index) => [keyOf(item, index), item]));
  }

  return isRecord(value) ? value : {};
};

const collect = ({ before, after, path, changes }: CollectChangesInput): void => {
  if (before === undefined && after === undefined) {
    return;
  }

  const beforeIsLeaf = isPrimitive(before);
  const afterIsLeaf = isPrimitive(after);

  if (beforeIsLeaf || afterIsLeaf) {
    if (before !== after) {
      changes.push({ path, ...(beforeIsLeaf ? { before } : {}), ...(afterIsLeaf ? { after } : {}) });
    }

    return;
  }

  const left = toRecord(before);
  const right = toRecord(after);

  for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
    collect({ before: left[key], after: right[key], path: path ? `${path}.${key}` : key, changes });
  }
};

export const diffSpecs = ({ before, after, path = '' }: DiffInput): SpecChange[] => {
  const changes: SpecChange[] = [];

  collect({ before, after, path, changes });

  return changes;
};
