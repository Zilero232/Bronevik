'use client';

import { API_PLAN_LIMITS } from '@bronevik/schemas';
import { useFormatter, useTranslations } from 'next-intl';

import { API_REFERENCE, PLANS } from '../../../config';

import s from './LimitFigures.module.scss';

export const LimitFigures = () => {
  const t = useTranslations('developers.figures');
  const format = useFormatter();

  return (
    <dl className={s.root}>
      {PLANS.figures.map((metric) => (
        <div key={metric} className={s.figure}>
          <dt className={s.label}>{t(metric)}</dt>
          <dd className={s.value}>{format.number(API_PLAN_LIMITS[PLANS.open][metric])}</dd>
        </div>
      ))}
      <div className={s.figure}>
        <dt className={s.label}>{t('version')}</dt>
        <dd className={s.value}>{API_REFERENCE.version}</dd>
      </div>
    </dl>
  );
};
