import { isPlainObject } from 'remeda';

import type { CollectChangesInput, DiffInput, KeyOfInput, SpecChange, SpecPrimitive } from '../importer.types';

import { DIFF_KEYS } from '../importer.constants';

const isPrimitive = (value: unknown): value is SpecPrimitive =>
  value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const keyOf = ({ item, index }: KeyOfInput): string => {
  if (isPlainObject(item)) {
    const key = DIFF_KEYS.find((candidate) => typeof item[candidate] === 'string');

    if (key) {
      return String(item[key]);
    }
  }

  return String(index);
};

const toRecord = (value: unknown): Record<string, unknown> => {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.map((item, index) => [keyOf({ item, index }), item]));
  }

  return isPlainObject(value) ? value : {};
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
