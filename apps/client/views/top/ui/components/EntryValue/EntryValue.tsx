'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { signed } from '@/entities/player/stats';
import { percentText, toneOfTier } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import type { EntryValueProps } from './EntryValue.types';

import s from './EntryValue.module.scss';

export const EntryValue = ({ entry, filter, size = 'sm' }: EntryValueProps) => {
  const t = useTranslations('top');
  const format = useFormatter();

  const { value, tier, delta } = entry;
  const isPercent = filter.metric === 'winRate' && filter.scope !== 'marks';
  const text = isPercent ? percentText({ format, value, digits: 2 }) : format.number(value, { maximumFractionDigits: 0 });

  const label = filter.scope === 'marks' ? t('marksLabel') : t(`metrics.${filter.metric}`);

  return (
    <span className={s.valueCell}>
      <RatingBadge
        label={size === 'lg' ? label : undefined}
        size={size === 'lg' ? 'lg' : 'sm'}
        tone={tier ? toneOfTier(tier) : 'average'}
        value={text}
        withPips={size === 'lg'}
      />
      {delta !== null && <span className={s.delta}>{signed({ value: delta })}</span>}
    </span>
  );
};
