'use client';

import { useTranslations } from 'next-intl';

import { DeltaValue, Skeleton } from '@/ui-kit';

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
    <span className={s.root} data-best={cell?.isBest ?? false} data-worst={cell?.isWorst ?? false}>
      <span className={s.value}>{cell?.display ?? '—'}</span>
      {cell?.isBest && <span className={s.srOnly}>{t('best')}</span>}
      {cell?.isWorst && <span className={s.srOnly}>{t('worst')}</span>}
      {cell?.delta !== null && cell?.delta !== undefined && (
        <DeltaValue className={s.delta} format='signedPercent' isLowerBetter={cell.isLowerBetter} value={cell.delta} />
      )}
      {cell?.ratio !== null && cell?.ratio !== undefined && (
        <span aria-hidden className={s.track}>
          <span className={s.bar} style={{ width: `${cell.ratio * 100}%` }} />
        </span>
      )}
    </span>
  );
};
