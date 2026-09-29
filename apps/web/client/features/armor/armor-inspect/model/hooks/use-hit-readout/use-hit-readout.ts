'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { HitReport } from '../../../lib/hit-report';

export const useHitReadout = ({ first, total, penetration, chance, layerCount }: HitReport) => {
  const t = useTranslations('armor.hit');
  const format = useFormatter();

  return [
    { key: 'nominal', value: t('mm', { value: first.thickness }) },
    { key: 'angle', value: t('degrees', { value: Math.round(first.angle) }) },
    { key: 'effective', value: t('mm', { value: Math.round(first.effective) }) },
    { key: 'total', value: `${t('mm', { value: Math.round(total) })} · ${t('layers', { count: layerCount })}` },
    { key: 'penetration', value: t('mm', { value: Math.round(penetration) }) },
    { key: 'chanceLabel', value: format.number(chance, { style: 'percent', maximumFractionDigits: 0 }) }
  ] as const;
};
