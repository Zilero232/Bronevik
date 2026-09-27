'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Card, CardHeader } from '@/ui-kit';

import type { TopEndpointsProps } from './TopEndpoints.types';

import { topEndpointShares } from '../../../../../lib/usage-stats';

import s from './TopEndpoints.module.scss';

export const TopEndpoints = ({ endpoints }: TopEndpointsProps) => {
  const t = useTranslations('developer.usage');
  const format = useFormatter();
  const top = topEndpointShares(endpoints);

  return (
    <Card className={s.root}>
      <CardHeader title={t('top')} />
      {top.length === 0 && <p className={s.empty}>{t('topEmpty')}</p>}
      <ol className={s.list}>
        {top.map(({ endpoint, requests, share }) => (
          <li key={endpoint} className={s.item}>
            <code className={s.endpoint}>{endpoint}</code>
            <span className={s.count}>{format.number(requests)}</span>
            <span aria-hidden className={s.bar} style={{ '--share': share }} />
          </li>
        ))}
      </ol>
    </Card>
  );
};
