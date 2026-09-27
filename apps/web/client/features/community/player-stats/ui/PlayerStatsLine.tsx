'use client';

import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'next-intl';

import { percentText } from '@/shared/lib';

import type { PlayerStatsLineProps } from './PlayerStatsLine.types';

import { statsTones, winRatePercent } from '../lib/stats-tones';

import s from './PlayerStatsLine.module.scss';

export const PlayerStatsLine = ({ stats, className }: PlayerStatsLineProps) => {
  const t = useTranslations('community.stats');
  const format = useFormatter();

  if (!stats) {
    return <span className={clsx(s.empty, className)}>{t('none')}</span>;
  }

  const tones = statsTones(stats);

  return (
    <dl className={clsx(s.root, className)}>
      <div className={s.item}>
        <dt className={s.label}>{t('battles')}</dt>
        <dd className={s.value}>{format.number(stats.battles)}</dd>
      </div>
      <div className={s.item}>
        <dt className={s.label}>{t('wn8')}</dt>
        <dd className={s.value} data-tone={tones.wn8 ?? undefined}>
          {stats.wn8 === null ? '—' : format.number(Math.round(stats.wn8))}
        </dd>
      </div>
      <div className={s.item}>
        <dt className={s.label}>{t('winRate')}</dt>
        <dd className={s.value} data-tone={tones.winRate ?? undefined}>
          {percentText({ format, value: winRatePercent(stats.winRate) })}
        </dd>
      </div>
    </dl>
  );
};
