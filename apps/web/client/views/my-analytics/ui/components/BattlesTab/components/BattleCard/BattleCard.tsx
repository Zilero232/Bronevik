'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard } from '@/entities/tank/tank';
import { MediaCard } from '@/ui-kit';

import type { BattleCardProps } from './BattleCard.types';

import { MoeCell } from '../MoeCell';
import { ResultCell } from '../ResultCell';

export const BattleCard = ({ battle, href }: BattleCardProps) => {
  const t = useTranslations('analytics.columns');
  const format = useFormatter();

  const result = <ResultCell result={battle.result} survived={battle.survived} />;

  if (!battle.vehicle) {
    return <MediaCard aspect='wide' href={href} media={null} sub={result} title={battle.mapName ?? battle.tankId} />;
  }

  return (
    <TankShowcaseCard
      figures={[
        { id: 'damage', label: t('damage'), value: format.number(battle.damageDealt) },
        { id: 'assisted', label: t('assisted'), value: format.number(battle.damageAssisted) },
        { id: 'moe', label: t('moe'), value: <MoeCell delta={battle.moePercentDelta} percent={battle.moePercent} /> }
      ]}
      href={href}
      layout='row'
      meta={result}
      vehicle={battle.vehicle}
    />
  );
};
