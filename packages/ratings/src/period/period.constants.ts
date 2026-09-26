import type { BattleTotals } from '../stats';
import type { PeriodWindow, RecentPeriod } from './period.types';

export const RECENT_PERIODS = ['24h', '7d', '30d', '60d', '1000'] as const;

export const PERIOD_WINDOWS = {
  '24h': { kind: 'duration', days: 1 },
  '7d': { kind: 'duration', days: 7 },
  '30d': { kind: 'duration', days: 30 },
  '60d': { kind: 'duration', days: 60 },
  '1000': { kind: 'battles', count: 1000 }
} as const satisfies Record<RecentPeriod, PeriodWindow>;

export const OPTIONAL_TOTAL_KEYS = ['losses', 'xp', 'survivedBattles', 'damageReceived', 'hits', 'shots'] as const;

export const EMPTY_TOTALS = {
  battles: 0,
  wins: 0,
  damageDealt: 0,
  frags: 0,
  spotted: 0,
  capturePoints: 0,
  droppedCapturePoints: 0
} as const satisfies BattleTotals;
