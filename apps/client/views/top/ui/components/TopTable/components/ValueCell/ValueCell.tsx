'use client';

import { useFormatter } from 'next-intl';

import { signed } from '@/entities/player/stats';
import { percentText, toneOfTier } from '@/shared/lib';

import type { ValueCellProps } from './ValueCell.types';

import s from './ValueCell.module.scss';

export const ValueCell = ({ entry: { value, tier, delta }, filter, isHero = false }: ValueCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root} data-hero={isHero}>
      {delta !== null && <span className={s.delta}>{signed({ value: delta })}</span>}
      <span className={s.value} data-tone={tier ? toneOfTier(tier) : undefined}>
        {filter.metric === 'winRate' && filter.scope !== 'marks'
          ? percentText({ format, value, digits: 2 })
          : format.number(value, { maximumFractionDigits: 0 })}
      </span>
    </span>
  );
};
