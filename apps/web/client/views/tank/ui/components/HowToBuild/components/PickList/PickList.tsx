'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { percentText } from '@/shared/lib';

import type { PickListProps } from './PickList.types';

import { UsageList } from '../UsageList';
import { UsageRow } from '../UsageRow';

import s from './PickList.module.scss';

export const PickList = ({ picks, title }: PickListProps) => {
  const t = useTranslations('tank.builds');
  const format = useFormatter();

  return (
    <UsageList title={title}>
      {picks.map(({ option, share, winRate }) => (
        <UsageRow
          key={option.id}
          valueLabel={
            <span className={s.value}>
              {percentText({ format, value: share * 100, digits: 0 })}
              {winRate !== null && <span className={s.win}>{t('winRate', { value: percentText({ format, value: winRate, digits: 1 }) })}</span>}
            </span>
          }
          image={option.image}
          kind={option.kind}
          label={option.name}
          share={share}
        />
      ))}
    </UsageList>
  );
};
