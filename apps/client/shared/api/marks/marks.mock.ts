import type { MasteryThreshold, MoeHistory, MoeHistoryBatch, MoePage, MoeProjection, MoeRow, MoeThreshold } from '@bronevik/schemas';

import { MOE, projectMoeBattles } from '@bronevik/ratings';
import { addDays, formatISO, parseISO } from 'date-fns';
import { sortBy } from 'remeda';

import type { MockTank } from '@/shared/mocks';

import { seededRandom } from '@/shared/lib';
import { findMockVehicle, MOCK_VEHICLES, mockVehicleSummary } from '@/shared/mocks';

import type { MockThresholdInput, MoeHistoryBatchInput, MoeHistoryInput, MoeListInput, MoeProjectionInput } from './marks.types';

import { MOE_MOCK } from './marks.constants';

const dateOf = (daysAgo: number) => formatISO(addDays(parseISO(MOE_MOCK.today), -daysAgo), { representation: 'date' });

const drift = ({ tank, daysAgo }: MockThresholdInput) => {
  const random = seededRandom(tank.id + daysAgo * 13);
  const wave = Math.sin((daysAgo + tank.id) / 23) * 0.035;

  return 1 + wave + (daysAgo / MOE_MOCK.historyDays) * -0.04 + (random() - 0.5) * 0.01;
};

export const mockMoeThreshold = ({ tank, daysAgo }: MockThresholdInput): MoeThreshold => {
  const p95 = Math.round(tank.moe3 * drift({ tank, daysAgo }));
  const { ratios } = MOE_MOCK;

  return {
    tankId: tank.id,
    date: dateOf(daysAgo),
    source: 'bronevik',
    p65: Math.round(p95 * ratios.p65),
    p85: Math.round(p95 * ratios.p85),
    p95,
    p100: Math.round(p95 * ratios.p100)
  };
};

export const mockMasteryThreshold = (tank: MockTank): MasteryThreshold => {
  const base = tank.moe3 * MOE_MOCK.xpPerDamage * 2.2;
  const { mastery } = MOE_MOCK;

  return {
    tankId: tank.id,
    date: MOE_MOCK.today,
    source: 'bronevik',
    class3: Math.round(base * mastery.class3),
    class2: Math.round(base * mastery.class2),
    class1: Math.round(base * mastery.class1),
    master: Math.round(base * mastery.master)
  };
};

const moeRow = (tank: MockTank): MoeRow => {
  const moe = mockMoeThreshold({ tank, daysAgo: 0 });
  const week = mockMoeThreshold({ tank, daysAgo: 7 });
  const month = mockMoeThreshold({ tank, daysAgo: 30 });

  return {
    vehicle: mockVehicleSummary(tank),
    moe,
    mastery: mockMasteryThreshold(tank),
    trend: { p95Delta7d: moe.p95 - week.p95, p95Delta30d: moe.p95 - month.p95 },
    updatedAt: `${MOE_MOCK.today}T04:00:00+03:00`
  };
};

const sortValue = (row: MoeRow, sort: NonNullable<MoeListInput['sort']>) => {
  if (sort === 'tier') {
    return row.vehicle.tier;
  }

  if (sort === 'master') {
    return row.mastery?.master ?? 0;
  }

  if (sort === 'p95Delta30d') {
    return row.trend.p95Delta30d ?? 0;
  }

  return row.moe?.[sort] ?? 0;
};

export const mockMoeList = ({
  tiers,
  types,
  nations,
  premium,
  search,
  sort = 'p95',
  order = 'desc',
  limit = 100,
  offset = 0
}: MoeListInput): MoePage => {
  const rows = MOCK_VEHICLES.filter(
    ({ tier, type, nation, isPremium }) =>
      (!tiers?.length || tiers.includes(tier)) &&
      (!types?.length || types.includes(type)) &&
      (!nations?.length || nations.includes(nation)) &&
      (premium === undefined || premium === isPremium)
  )
    .filter(({ name }) => !search || name.toLocaleLowerCase('ru').includes(search.toLocaleLowerCase('ru')))
    .map(moeRow);

  const sorted = sortBy(rows, [(row) => sortValue(row, sort), order]);

  return { items: sorted.slice(offset, offset + limit), total: sorted.length, limit, offset };
};

export const mockMoeHistory = ({ tankId }: MoeHistoryInput): MoeHistory => {
  const tank = findMockVehicle(tankId);

  if (!tank) {
    return [];
  }

  const count = Math.floor(MOE_MOCK.historyDays / MOE_MOCK.historyStep);

  return Array.from({ length: count }, (_, index) => mockMoeThreshold({ tank, daysAgo: (count - 1 - index) * MOE_MOCK.historyStep }));
};

export const mockMoeProjection = ({ tankId, currentPercent, targetMarks, avgDamage }: MoeProjectionInput): MoeProjection => {
  const tank = findMockVehicle(tankId);
  const moe = tank ? mockMoeThreshold({ tank, daysAgo: 0 }) : null;
  const target = MOE.markPercents[targetMarks - 1] ?? MOE.markPercents[2];
  const projection = moe
    ? projectMoeBattles({
        currentPercent: currentPercent ?? 0,
        targetPercent: target,
        averageCombinedDamage: avgDamage,
        thresholds: { oneMark: moe.p65, twoMarks: moe.p85, threeMarks: moe.p95, hundredPercent: moe.p100 ?? undefined }
      })
    : null;

  return { tankId, currentPercent, targetMarks, avgDamage, battlesNeeded: projection?.battles ?? null };
};

export const mockMoeHistoryBatch = ({ tankIds, days = MOE_MOCK.sparkDays }: MoeHistoryBatchInput): MoeHistoryBatch => ({
  days,
  series: tankIds.flatMap((tankId) => {
    const tank = findMockVehicle(tankId);

    return tank
      ? [
          {
            tankId,
            points: Array.from({ length: days }, (_, index) => {
              const { date, p65, p85, p95, p100 } = mockMoeThreshold({ tank, daysAgo: days - 1 - index });

              return { date, p65, p85, p95, p100 };
            })
          }
        ]
      : [];
  })
});
