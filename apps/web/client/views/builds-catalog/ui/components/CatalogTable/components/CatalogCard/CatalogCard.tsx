'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankShowcaseCard, WinRateCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { PERCENT_TEXT } from '@/shared/lib';

import type { CatalogCardProps } from './CatalogCard.types';

import { CoverageCell } from '../CoverageCell';
import { PicksCell } from '../PicksCell';

export const CatalogCard = ({ entry: { vehicle, battles, players, isEnough, winRate, avgDamage, topEquipment } }: CatalogCardProps) => {
  const t = useTranslations('buildsCatalog.table');
  const format = useFormatter();

  return (
    <TankShowcaseCard
      figures={[
        { id: 'winRate', label: t('winRate'), value: <WinRateCell value={winRate} /> },
        {
          id: 'avgDamage',
          label: t('avgDamage'),
          value: avgDamage === null ? PERCENT_TEXT.empty : format.number(avgDamage, { maximumFractionDigits: 0 })
        }
      ]}
      footer={<PicksCell picks={topEquipment} />}
      href={ROUTES.builds.detail(vehicle.slug)}
      layout='row'
      meta={<CoverageCell battles={battles} isEnough={isEnough} players={players} />}
      vehicle={vehicle}
    />
  );
};
