import type { StatsBlock } from '@bronevik/schemas';

import type { Locale } from '@/shared/i18n';

import type { PlayerOgLabels, SessionOgLabels } from '../og-labels';

export type OgMetric = {
  key: string;
  label: string;
  value: string;
  color: string;
};

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
