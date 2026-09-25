'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROW_ITEM } from '@/shared/lib';
import { Card, CardHeader } from '@/ui-kit';

import type { TopEndpointsProps } from './TopEndpoints.types';

import { USAGE } from '../../../../../config';
import { quotaShare } from '../../../../../lib/usage-stats';

import s from './TopEndpoints.module.scss';

export const TopEndpoints = ({ endpoints }: TopEndpointsProps) => {
  const t = useTranslations('developer.usage');
  const format = useFormatter();

  const top = endpoints.slice(0, USAGE.topEndpoints);
  const peak = Math.max(0, ...top.map(({ requests }) => requests));

  return (
    <Card className={s.root}>
      <CardHeader eyebrow={t('topEyebrow')} title={t('top')} />
      {top.length === 0 && <p className={s.empty}>{t('topEmpty')}</p>}
      <ol className={s.list}>
        {top.map(({ endpoint, requests }, index) => (
          <motion.li key={endpoint} animate='visible' className={s.item} custom={index} initial='hidden' variants={ROW_ITEM}>
            <code className={s.endpoint}>{endpoint}</code>
            <span className={s.count}>{format.number(requests)}</span>
            <span aria-hidden className={s.bar} style={{ '--share': quotaShare({ used: requests, limit: peak }) }} />
          </motion.li>
        ))}
      </ol>
    </Card>
  );
};
