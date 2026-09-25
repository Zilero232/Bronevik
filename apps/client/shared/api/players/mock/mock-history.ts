import type { TimeSeries, TimeSeriesGranularity, TimeSeriesMetric } from '@bronevik/schemas';

import { subDays, subMonths, subWeeks } from 'date-fns';

import type { MockPlayer } from '@/shared/mocks';

import { seededRandom } from '@/shared/lib';

import type { MockHistoryInput } from './mock.types';

import { mockPlayerById } from './mock-player';
import { round } from './mock.helpers';

const LENGTH = { day: 120, week: 52, month: 24 } as const satisfies Record<TimeSeriesGranularity, number>;

const STEP = { day: subDays, week: subWeeks, month: subMonths } as const;

const SCALE = { day: 1, week: 6, month: 24 } as const satisfies Record<TimeSeriesGranularity, number>;

const BASE = {
  wn8: (player: MockPlayer) => player.wn8,
  winRate: (player: MockPlayer) => player.winRate,
  avgDamage: (player: MockPlayer) => player.avgDamage,
  battles: () => 18,
  broneIndex: (player: MockPlayer) => player.broneIndex,
  eff: (player: MockPlayer) => 500 + player.wn8 * 0.52
} as const satisfies Record<TimeSeriesMetric, (player: MockPlayer) => number>;

const SPREAD = { wn8: 0.09, winRate: 0.05, avgDamage: 0.08, battles: 0.9, broneIndex: 0.03, eff: 0.06 } as const;

const MARKERS = [
  { daysAgo: 96, kind: 'patch', label: '2.1' },
  { daysAgo: 54, kind: 'event', label: 'Натиск' },
  { daysAgo: 21, kind: 'patch', label: '2.2' }
] as const;

export const mockHistory = ({ accountId, metric, granularity }: MockHistoryInput): TimeSeries => {
  const player = mockPlayerById(accountId);
  const random = seededRandom(accountId + metric.length * 97 + LENGTH[granularity]);
  const base = BASE[metric](player);
  const scale = SCALE[granularity];
  const length = LENGTH[granularity];

  let drift = 0;

  const points = Array.from({ length }, (_, index) => {
    const offset = length - 1 - index;

    drift += (random() - 0.47) * SPREAD[metric] * 0.35;

    const battles = round(random() * 30 * scale);
    const raw = metric === 'battles' ? battles : base * (1 + drift + (random() - 0.5) * SPREAD[metric]);

    return {
      at: STEP[granularity](new Date(), offset).toISOString(),
      value: battles === 0 && metric !== 'battles' ? null : round(raw, metric === 'winRate' ? 2 : 0),
      battles
    };
  });

  return {
    metric,
    granularity,
    points,
    markers: MARKERS.map(({ daysAgo, kind, label }) => ({ at: subDays(new Date(), daysAgo).toISOString(), kind, label }))
  };
};
