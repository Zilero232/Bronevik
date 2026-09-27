import { groupBy, mapValues, prop, sumBy } from 'remeda';

import type { RotationCount, RotationShare } from './rotation-share.types';

import { percentOf } from '../../../../common/lib';

const scopeOf = (row: RotationCount): string => `${row.tier}|${row.mode}`;

export const withShares = (rows: readonly RotationCount[]): RotationShare[] => {
  const totals = mapValues(groupBy(rows, scopeOf), (group) => sumBy(group, prop('battles')));

  return rows.map((row) => ({ ...row, share: percentOf({ value: row.battles, by: totals[scopeOf(row)] ?? 0 }) ?? 0 }));
};
