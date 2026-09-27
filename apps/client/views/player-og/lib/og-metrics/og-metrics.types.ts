import type { StatsBlock } from '@otmetki/schemas';

import type { PlayerWrapped } from '@/entities/player/profile';
import type { Locale } from '@/shared/i18n';

import type { PlayerOgLabels, SessionOgLabels, WrappedOgLabels } from '../og-labels';

export type OgStats = Pick<StatsBlock, 'avgDamage' | 'battles' | 'broneIndex' | 'winRate' | 'wn8'>;

export type PlayerOgMetricsInput = {
  stats: OgStats;
  labels: PlayerOgLabels;
  locale: Locale;
};

export type SessionOgMetricsInput = {
  stats: OgStats;
  labels: SessionOgLabels;
  locale: Locale;
};

export type SessionOgDateInput = {
  startedAt: string;
  locale: Locale;
};

export type OrDashInput = {
  value: number | null;
  render: (known: number) => string;
};

export type WrappedOgMetricsInput = {
  wrapped: Pick<PlayerWrapped, 'avgDamage' | 'battles' | 'marksGained' | 'winRate'>;
  labels: WrappedOgLabels;
  locale: Locale;
};
