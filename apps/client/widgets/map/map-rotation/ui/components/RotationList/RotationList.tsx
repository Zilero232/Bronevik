'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { CAMOUFLAGE_TONE, isMapCamouflage, useMapLabels } from '@/entities/map/map';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, CellBar } from '@/ui-kit';

import type { RotationListProps } from './RotationList.types';

import s from './RotationList.module.scss';

export const RotationList = ({ rows, maxShare }: RotationListProps) => {
  const t = useTranslations('mapStats.rotation');
  const format = useFormatter();
  const labels = useMapLabels();

  return (
    <ol className={s.root}>
      {rows.map((row, index) => (
        <li key={row.arenaId} className={s.row}>
          <span className={s.rank}>{index + 1}</span>
          <span className={s.name}>
            {row.slug ? (
              <Link className={s.link} href={ROUTES.maps.detail(row.slug)}>
                {row.name}
              </Link>
            ) : (
              row.name
            )}
            {row.camouflageType && (
              <Badge tone={isMapCamouflage(row.camouflageType) ? CAMOUFLAGE_TONE[row.camouflageType] : 'neutral'}>
                {labels.camouflage(row.camouflageType)}
              </Badge>
            )}
          </span>
          <CellBar className={s.share} max={maxShare} value={row.share}>
            {format.number(row.share / 100, { style: 'percent', maximumFractionDigits: 1 })}
          </CellBar>
          <span className={s.battles}>{t('battles', { count: row.battles })}</span>
        </li>
      ))}
    </ol>
  );
};
