'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ModeRankBadge } from '@/entities/mode/mode';
import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { PERCENT_TEXT } from '@/shared/lib';

import type { ModeTankCardProps } from './ModeTankCard.types';

export const ModeTankCard = ({ tank: { vehicle, rank, winRate, avgDamage, battles } }: ModeTankCardProps) => {
  const t = useTranslations('modes.table');
  const format = useFormatter();

  return (
    <TankShowcaseCard
      figures={[
        { id: 'winRate', label: t('winRate'), value: <WinRateCell value={winRate} /> },
        {
          id: 'avgDamage',
          label: t('avgDamage'),
          value: avgDamage === null ? PERCENT_TEXT.empty : format.number(avgDamage, { maximumFractionDigits: 0 })
        },
        { id: 'battles', label: t('battles'), value: format.number(battles) }
      ]}
      layout='row'
      meta={<ModeRankBadge rank={rank} />}
      vehicle={vehicle}
    />
  );
};
