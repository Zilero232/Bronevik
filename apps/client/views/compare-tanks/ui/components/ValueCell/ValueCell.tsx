'use client';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import type { ValueCellProps } from './ValueCell.types';

import s from './ValueCell.module.scss';

export const ValueCell = ({ cell, isLoading }: ValueCellProps) => {
  const t = useTranslations('tanks.compare.board');

  if (isLoading) {
    return (
      <span className={s.root}>
        <Skeleton height={12} shape='line' width='55%' />
      </span>
    );
  }

  return (
    <span className={s.root} data-best={cell?.isBest ?? false}>
      <span className={s.value}>{cell?.display ?? '—'}</span>
      {cell?.isBest && <span className={s.srOnly}>{t('best')}</span>}
      {cell?.ratio !== null && cell?.ratio !== undefined && (
        <span aria-hidden className={s.track}>
          <span className={s.bar} style={{ width: `${cell.ratio * 100}%` }} />
        </span>
      )}
    </span>
  );
};
