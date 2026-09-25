import { unique } from 'remeda';

import type { CollectIdsInput, WalkInput } from './seed.types';

import { SEED } from './seed.constants';

const walk = ({ value, key, depth, into }: WalkInput) => {
  if (depth > SEED.maxDepth || value === null || typeof value !== 'object') {
    return;
  }

  const entries = Array.isArray(value) ? value.map((item): [string, unknown] => ['', item]) : Object.entries(value);

  for (const [name, child] of entries) {
    if (name === key && typeof child === 'number' && Number.isInteger(child) && child > 0) {
      into.push(child);

      continue;
    }

    walk({ value: child, key, depth: depth + 1, into });
  }
};

export const collectIds = ({ value, key, depth = 0 }: CollectIdsInput): number[] => {
  const ids: number[] = [];

  walk({ value, key, depth, into: ids });

  return unique(ids);
};
