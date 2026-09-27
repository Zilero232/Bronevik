import type { StatLine } from '@otmetki/schemas';

export type StatColumnsRow = Pick<StatLine, 'avgDamage' | 'battles' | 'winRate'>;

export type WinRateDeltaRow = {
  winRateDelta: number | null;
};

export type WinRateDeltaHeader = 'winRateDelta' | 'winRateVsAverage' | 'winRateVsSolo';
