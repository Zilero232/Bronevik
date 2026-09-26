import { createFormatter } from 'next-intl';

import type { Locale } from '@/shared/i18n';
import type { OgMetric } from '@/shared/seo/og';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { FORMATS, TIME_ZONE } from '@/shared/i18n';
import { OG_COLORS, OG_TONES } from '@/shared/seo/og';

import type { OrDashInput, PlayerOgMetricsInput, SessionOgDateInput, SessionOgMetricsInput } from './og-metrics.types';

const formatterOf = (locale: Locale) => createFormatter({ locale, formats: FORMATS, timeZone: TIME_ZONE });

const orDash = ({ value, render }: OrDashInput) => (value === null ? '—' : render(value));

export const playerOgMetrics = ({ stats, labels, locale }: PlayerOgMetricsInput): OgMetric[] => {
  const format = formatterOf(locale);
  const { broneIndex, wn8, winRate, battles } = stats;

  return [
    {
      key: 'broneIndex',
      label: labels.broneIndex,
      value: orDash({ value: broneIndex.value, render: (value) => format.number(value, 'integer') }),
      color: OG_TONES[ratingValueTone(broneIndex)]
    },
    {
      key: 'wn8',
      label: 'WN8',
      value: orDash({ value: wn8.value, render: (value) => format.number(value, 'integer') }),
      color: OG_TONES[ratingValueTone(wn8)]
    },
    {
      key: 'winRate',
      label: labels.winRate,
      value: orDash({ value: winRate, render: (value) => format.number(value / 100, 'percent') }),
      color: OG_TONES[winRateTone(winRate)]
    },
    { key: 'battles', label: labels.battles, value: format.number(battles, 'integer'), color: OG_COLORS.text }
  ];
};

export const sessionOgMetrics = ({ stats, labels, locale }: SessionOgMetricsInput): OgMetric[] => {
  const format = formatterOf(locale);
  const { battles, winRate, avgDamage, wn8 } = stats;

  return [
    { key: 'battles', label: labels.battles, value: format.number(battles, 'integer'), color: OG_COLORS.text },
    {
      key: 'winRate',
      label: labels.winRate,
      value: orDash({ value: winRate, render: (value) => format.number(value / 100, 'percent') }),
      color: OG_TONES[winRateTone(winRate)]
    },
    {
      key: 'avgDamage',
      label: labels.avgDamage,
      value: orDash({ value: avgDamage, render: (value) => format.number(value, 'integer') }),
      color: OG_COLORS.text
    },
    {
      key: 'wn8',
      label: 'WN8',
      value: orDash({ value: wn8.value, render: (value) => format.number(value, 'integer') }),
      color: OG_TONES[ratingValueTone(wn8)]
    }
  ];
};

export const sessionOgDate = ({ startedAt, locale }: SessionOgDateInput): string =>
  formatterOf(locale).dateTime(new Date(startedAt), { day: 'numeric', month: 'long', year: 'numeric' });
