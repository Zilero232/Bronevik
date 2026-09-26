'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { ValueCellProps } from './ValueCell.types';

import { displayValue } from '../../../../../lib/compare-rows';

import s from './ValueCell.module.scss';

export const ValueCell = ({ value, format, isBest }: ValueCellProps) => {
  const t = useTranslations('compare');
  const formatter = useFormatter();

  return (
    <span className={s.root} data-best={isBest} title={isBest ? t('best') : undefined}>
      {value === null ? '—' : formatter.number(displayValue({ value, format }), format)}
    </span>
  );
};
