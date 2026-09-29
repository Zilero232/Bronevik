'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ARMOR_PALETTE } from '@/entities/armor/armor-model';

import { ARMOR_HEAT_LEGEND } from '../../../../config';

import s from './HeatLegend.module.scss';

export const HeatLegend = () => {
  const t = useTranslations('armor.heatmap');
  const format = useFormatter();

  return (
    <figure className={s.root}>
      <figcaption className={s.caption}>{t('legend')}</figcaption>
      <span
        aria-hidden
        className={s.bar}
        style={{ '--heat-low': ARMOR_PALETTE.noPen, '--heat-mid': ARMOR_PALETTE.chance, '--heat-high': ARMOR_PALETTE.pen }}
      />
      <ol className={s.scale}>
        {ARMOR_HEAT_LEGEND.stops.map((stop) => (
          <li key={stop}>{format.number(stop, { style: 'percent' })}</li>
        ))}
      </ol>
      <p className={s.note}>{t('note')}</p>
    </figure>
  );
};
