'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard, TankStatusBadge } from '@/entities/tank/tank';
import { PERCENT_TEXT } from '@/shared/lib';

import type { EconomyCardProps } from './EconomyCard.types';

import { TANKS_ECONOMY } from '../../../../../config';

export const EconomyCard = ({ row: { vehicle, traits }, view }: EconomyCardProps) => {
  const t = useTranslations('tanks.economy.columns');
  const format = useFormatter();

  return (
    <TankShowcaseCard
      figures={TANKS_ECONOMY.cardFigures.map((id) => {
        const value = view?.[id] ?? null;

        return { id, label: t(id), value: value === null ? PERCENT_TEXT.empty : format.number(value) };
      })}
      layout='row'
      meta={<TankStatusBadge status={traits.status} />}
      vehicle={vehicle}
    />
  );
};
