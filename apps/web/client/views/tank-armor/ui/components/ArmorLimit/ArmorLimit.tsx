'use client';

import { useTranslations } from 'next-intl';

import { PlusTeaser } from '@/features/plus/plus-gate';

import type { ArmorLimitProps } from './ArmorLimit.types';

import s from './ArmorLimit.module.scss';

export const ArmorLimit = ({ audience, limit, freeLimit, resetsOn }: ArmorLimitProps) => {
  const t = useTranslations('armor.limit');

  return (
    <section className={s.root} data-testid='armor-limit'>
      <h2 className={s.title}>{t('title')}</h2>
      <p className={s.text}>{audience === 'anonymous' ? t('anonymous', { limit, free: freeLimit }) : t('free', { limit, date: resetsOn })}</p>
      <PlusTeaser feature='armor3d' />
    </section>
  );
};
