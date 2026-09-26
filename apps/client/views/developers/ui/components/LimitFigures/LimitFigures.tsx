'use client';

import { API_TIER_LIMITS } from '@otmetki/schemas';
import { useFormatter, useTranslations } from 'next-intl';

import { API_REFERENCE, TIERS } from '../../../config';

import s from './LimitFigures.module.scss';

export const LimitFigures = () => {
  const t = useTranslations('developers.figures');
  const format = useFormatter();

  return (
    <dl className={s.root}>
      {TIERS.figures.map((metric) => (
        <div key={metric} className={s.figure}>
          <dt className={s.label}>{t(metric)}</dt>
          <dd className={s.value}>{format.number(API_TIER_LIMITS[TIERS.open][metric])}</dd>
        </div>
      ))}
      <div className={s.figure}>
        <dt className={s.label}>{t('version')}</dt>
        <dd className={s.value}>{API_REFERENCE.version}</dd>
      </div>
    </dl>
  );
};
