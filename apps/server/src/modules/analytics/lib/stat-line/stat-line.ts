import type { AnalyticsBreakdown, BreakdownRow, StatLine, TrendPoint } from '@otmetki/schemas';

import { accountWn8 } from '@otmetki/ratings';
import { groupBy, sortBy, sumBy } from 'remeda';

import type { AggregateRow, BreakdownInput, GroupRowsInput, RawTankRow, StatLineInput, TrendPointsInput } from './stat-line.types';

import { percentOf } from '../../../../common/lib';

export const statLine = ({ rows, expected }: StatLineInput): StatLine => {
  const battles = sumBy(rows, (row) => row.battles);

  return {
    battles,
    winRate: percentOf({ value: sumBy(rows, (row) => row.wins), by: battles }),
    avgDamage: battles > 0 ? sumBy(rows, (row) => row.damageDealt) / battles : null,
    wn8: battles > 0 ? accountWn8({ tanks: rows, expected }).wn8 : null,
    survivalRate: percentOf({ value: sumBy(rows, (row) => row.survivedBattles), by: battles })
  };
};

const groupRows = ({ rows, expected, vehicles, keyOf }: GroupRowsInput): BreakdownRow[] => {
  const known = rows.filter((row) => vehicles.has(row.tankId));
  const groups = groupBy(known, (row: AggregateRow) => {
    const vehicle = vehicles.get(row.tankId);

    return vehicle ? keyOf(vehicle) : '';
  });

  return Object.entries(groups).map(([key, group]) => ({ key, ...statLine({ rows: group, expected }) }));
};

export const breakdown = (input: BreakdownInput): AnalyticsBreakdown => ({
  byTier: sortBy(groupRows({ ...input, keyOf: (vehicle) => String(vehicle.tier) }), [(row) => Number(row.key), 'desc']),
  byClass: sortBy(groupRows({ ...input, keyOf: (vehicle) => vehicle.type }), [(row) => row.battles, 'desc']),
  byNation: sortBy(groupRows({ ...input, keyOf: (vehicle) => vehicle.nation }), [(row) => row.battles, 'desc'])
});

export const toAggregateRow = (row: RawTankRow): AggregateRow => ({
  tankId: row.tank_id,
  battles: row.battles,
  wins: row.wins,
  damageDealt: row.damage,
  frags: row.frags,
  spotted: row.spotted,
  capturePoints: row.cap,
  droppedCapturePoints: row.def,
  survivedBattles: row.survived
});

export const trendPoints = ({ rows, expected }: TrendPointsInput): TrendPoint[] => {
  const groups = groupBy(rows, (row) => row.bucket.toISOString());

  return sortBy(Object.entries(groups), ([at]) => at).map(([at, group]) => {
    const { battles, winRate, avgDamage, wn8 } = statLine({ rows: group, expected });

    return { at, battles, winRate, avgDamage, wn8 };
  });
};
