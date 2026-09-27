'use client';

import { useTranslations } from 'next-intl';

import { TankShowcaseCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';

import type { BestBattleCardProps } from './BestBattleCard.types';

import { MapCell } from '../MapCell';
import { MetricCell } from '../MetricCell';

export const BestBattleCard = ({ battle, metric }: BestBattleCardProps) => {
  const t = useTranslations('bestBattles');

  return (
    <TankShowcaseCard
      figures={[
        { id: 'player', label: t('columns.player'), value: battle.nickname },
        { id: 'value', label: t(`metrics.${metric}`), value: <MetricCell value={battle[metric]} /> }
      ]}
      href={battle.replayId ? ROUTES.replays.detail(battle.replayId) : undefined}
      layout='row'
      meta={<MapCell battle={battle} />}
      vehicle={battle.vehicle}
    />
  );
};
