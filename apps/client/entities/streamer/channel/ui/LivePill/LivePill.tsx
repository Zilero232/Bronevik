'use client';

import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';

import type { LivePillProps } from './LivePill.types';

import s from './LivePill.module.scss';

export const LivePill = ({ live, className }: LivePillProps) => {
  const t = useTranslations('streamersDirectory.live');
  const format = useFormatter();

  return (
    <span className={clsx(s.root, className)}>
      <LiveLamp label={live.tankName ? t('onTank', { tank: live.tankName }) : t('on')} size='sm' />
      {live.viewers !== null && <span className={s.viewers}>{t('viewers', { count: live.viewers, value: format.number(live.viewers) })}</span>}
    </span>
  );
};
