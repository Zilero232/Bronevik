import { partition } from 'remeda';

import type { PinnedFirstInput } from './pinned-first.types';

export const pinnedFirst = <R extends { id: string }>({ rows, pinnedIds }: PinnedFirstInput<R>): R[] => {
  if (!pinnedIds?.length) {
    return [...rows];
  }

  const [pinned, rest] = partition(rows, (row) => pinnedIds.includes(row.id));

  return [...pinned, ...rest];
};
