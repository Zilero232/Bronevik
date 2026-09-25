'use client';

import { Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import type { ValueCellProps } from './ValueCell.types';

import { BAR_TRANSITION } from './ValueCell.motion';

import s from './ValueCell.module.scss';

export const ValueCell = ({ cell, label, unit, isLoading }: ValueCellProps) => {
  const t = useTranslations('tanks.compare.board');

  const isBest = cell?.isBest ?? false;
  const ratio = cell?.ratio ?? null;

  return (
    <div className={s.root} data-best={isBest}>
      <span className={s.srOnly}>{label}</span>
      {isLoading ? (
        <Skeleton height={14} shape='line' width='55%' />
      ) : (
        <span className={s.value}>
          {cell?.display ?? '—'}
          {unit && <span className={s.unit}>{unit}</span>}
        </span>
      )}
      {isBest && (
        <span className={s.crown} title={t('best')}>
          <Crown aria-hidden size={13} />
          <span className={s.srOnly}>{t('best')}</span>
        </span>
      )}
      {!isLoading && ratio !== null && (
        <span aria-hidden className={s.track}>
          <motion.span animate={{ scaleX: ratio }} className={s.bar} initial={{ scaleX: 0 }} transition={BAR_TRANSITION} />
        </span>
      )}
    </div>
  );
};
