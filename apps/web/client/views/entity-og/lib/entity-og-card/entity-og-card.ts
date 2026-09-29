import { toRoman } from '@otmetki/icons';
import { createFormatter, createTranslator } from 'next-intl';

import type { Locale } from '@/shared/i18n';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { ROUTES } from '@/shared/constants';
import { FORMATS, messages, TIME_ZONE } from '@/shared/i18n';
import { OG_COLORS, OG_TONES } from '@/shared/seo/og';

import type { ClanOgCardInput, DashInput, EntityOgCardData, SiteOgCardInput, TankOgCardInput } from './entity-og-card.types';

const toolsOf = (locale: Locale) => ({
  t: createTranslator({ locale, messages: messages[locale] }),
  format: createFormatter({ locale, formats: FORMATS, timeZone: TIME_ZONE })
});

const dash = ({ value, render }: DashInput) => (value === null ? '—' : render(value));

export const tankOgCard = ({ tank: { vehicle, serverStats }, kind, locale, host }: TankOgCardInput): EntityOgCardData => {
  const { t, format } = toolsOf(locale);
  const stats = serverStats[0] ?? null;
  const path = kind === 'build' ? ROUTES.builds.detail(vehicle.slug) : ROUTES.tanks.detail(vehicle.slug);

  return {
    heading: `${t('brand.name')} · ${t(`og.kinds.${kind}`)}`,
    title: vehicle.name,
    subtitle: t('og.tankLine', { tier: toRoman(vehicle.tier), type: t(`game.classes.${vehicle.type}`) }),
    metrics: [
      {
        key: 'winRate',
        label: t('og.winRate'),
        value: dash({ value: stats?.winRate ?? null, render: (value) => format.number(value / 100, 'percent') }),
        color: OG_TONES[winRateTone(stats?.winRate ?? null)]
      },
      {
        key: 'avgDamage',
        label: t('og.avgDamage'),
        value: dash({ value: stats?.avgDamage ?? null, render: (value) => format.number(value, 'integer') }),
        color: OG_COLORS.text
      },
      {
        key: 'players',
        label: t('og.players'),
        value: dash({ value: stats?.players ?? null, render: (value) => format.number(value, 'integer') }),
        color: OG_COLORS.text
      }
    ],
    url: `${host}${path}`,
    source: t('og.source')
  };
};

export const clanOgCard = ({ page: { clan, stats }, locale, host }: ClanOgCardInput): EntityOgCardData => {
  const { t, format } = toolsOf(locale);

  return {
    heading: `${t('brand.name')} · ${t('og.kinds.clan')}`,
    title: `[${clan.tag}]`,
    subtitle: clan.name,
    metrics: [
      {
        key: 'wn8',
        label: 'WN8',
        value: dash({ value: stats.avgWn8.value, render: (value) => format.number(value, 'integer') }),
        color: OG_TONES[ratingValueTone(stats.avgWn8)]
      },
      {
        key: 'winRate',
        label: t('og.winRate'),
        value: dash({ value: stats.avgWinRate, render: (value) => format.number(value / 100, 'percent') }),
        color: OG_TONES[winRateTone(stats.avgWinRate)]
      },
      { key: 'members', label: t('og.members'), value: format.number(clan.membersCount, 'integer'), color: OG_COLORS.text }
    ],
    url: `${host}${ROUTES.clans.detail(clan.tag)}`,
    source: t('og.source')
  };
};

export const siteOgCard = ({ locale, host }: SiteOgCardInput): EntityOgCardData => {
  const { t } = toolsOf(locale);

  return {
    heading: `${t('brand.name')} · ${t('og.kinds.site')}`,
    title: t('brand.name'),
    subtitle: t('brand.tagline'),
    metrics: [],
    url: host,
    source: t('og.source')
  };
};
