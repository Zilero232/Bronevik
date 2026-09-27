'use client';

import { useTranslations } from 'next-intl';

import { Badge, Card, CardHeader, EmptyState } from '@/ui-kit';

import type { MapStatsProps } from './MapStats.types';

import { TugOfWar } from '../TugOfWar';

export const MapStats = ({ stats }: MapStatsProps) => {
  const t = useTranslations('maps.map.stats');

  return (
    <Card padding='md'>
      <CardHeader action={stats && <Badge tone='steel'>{t(`source.${stats.source}`)}</Badge>} title={t('tugLabel')} />
      {stats ? <TugOfWar teams={stats.teams} /> : <EmptyState isCompact title={t('emptyTitle')} />}
    </Card>
  );
};
