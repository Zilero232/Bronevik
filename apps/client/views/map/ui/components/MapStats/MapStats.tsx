'use client';

import { BarChart3, Swords } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, EmptyState, StatTile } from '@/ui-kit';

import type { MapStatsProps } from './MapStats.types';

import { MAP_TEAMS } from '../../../config';
import { TugOfWar } from '../TugOfWar';

import s from './MapStats.module.scss';

export const MapStats = ({ stats }: MapStatsProps) => {
  const t = useTranslations('maps.map.stats');

  if (!stats) {
    return <EmptyState description={t('emptyDescription')} icon={<BarChart3 size={28} />} title={t('emptyTitle')} />;
  }

  const { battles, source, teams } = stats;
  const winRateOf = (team: number) => teams.find((row) => row.team === team)?.winRate ?? 0;

  return (
    <div className={s.root}>
      <div className={s.tiles}>
        <StatTile format={{ notation: 'compact', maximumFractionDigits: 1 }} icon={<Swords size={16} />} label={t('battles')} value={battles} />
        <Badge className={s.source} tone='steel'>
          {t(`source.${source}`)}
        </Badge>
      </div>
      <TugOfWar team1={winRateOf(MAP_TEAMS.first)} team2={winRateOf(MAP_TEAMS.second)} />
    </div>
  );
};
