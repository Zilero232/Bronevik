'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingTone } from '@/shared/lib';

import type { ValueCellProps } from './ValueCell.types';

import s from './ValueCell.module.scss';

export const ValueCell = ({ metric, value }: ValueCellProps) => {
  const t = useTranslations('social.leagues');
  const format = useFormatter();

  if (value === null) {
    return (
      <span className={s.muted} title={t('unrankedHint')}>
        {t('standing.unranked')}
      </span>
    );
  }

  return (
    <span className={s.root} data-tone={metric === 'wn8' ? ratingTone({ scale: 'wn8', value }) : undefined}>
      {format.number(value, 'integer')}
    </span>
  );
};
