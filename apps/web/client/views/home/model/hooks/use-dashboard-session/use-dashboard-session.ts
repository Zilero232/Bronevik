'use client';

import type { SessionListItem } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';

import type { StatListItem } from '@/ui-kit';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';

export const useDashboardSession = (session: SessionListItem | null | undefined) => {
  const t = useTranslations('home.dashboard.session');

  const items: StatListItem[] = session
    ? [
        { id: 'battles', label: t('battles'), value: session.stats.battles },
        { id: 'winRate', label: t('winRate'), value: session.stats.winRate, kind: 'percent', tone: winRateTone(session.stats.winRate) },
        { id: 'wn8', label: t('wn8'), value: session.stats.wn8.value, tone: ratingValueTone(session.stats.wn8) },
        { id: 'avgDamage', label: t('avgDamage'), value: session.stats.avgDamage }
      ]
    : [];

  return { items, startedAt: session?.startedAt ?? null };
};
