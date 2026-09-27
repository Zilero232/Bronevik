'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Card, CardHeader, ProgressBar } from '@/ui-kit';

import type { BreakdownCardProps } from './BreakdownCard.types';

import s from './BreakdownCard.module.scss';

export const BreakdownCard = ({ breakdown }: BreakdownCardProps) => {
  const t = useTranslations('analytics.battle.breakdown');
  const format = useFormatter();

  return (
    <Card padding='none'>
      <CardHeader title={t('title')} />
      <ul className={s.bars}>
        {breakdown.map(({ key, value, share }) => (
          <li key={key}>
            <ProgressBar
              label={t(key)}
              size='sm'
              tone={key === 'blocked' ? 'steel' : 'accent'}
              value={share}
              valueLabel={format.number(value, 'integer')}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
};
