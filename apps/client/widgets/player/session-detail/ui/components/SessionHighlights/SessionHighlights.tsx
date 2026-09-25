'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone } from '@/entities/player/stats';
import { TankIdentity, vehicleIdentity } from '@/entities/tank/tank';
import { RatingBadge } from '@/ui-kit';

import type { SessionHighlightsProps } from './SessionHighlights.types';

import s from './SessionHighlights.module.scss';

export const SessionHighlights = ({ best, worst }: SessionHighlightsProps) => {
  const t = useTranslations('profile.sessions');
  const format = useFormatter();

  const items = [
    { key: 'best', entry: best, icon: <ArrowUpRight size={16} /> },
    { key: 'worst', entry: worst, icon: <ArrowDownRight size={16} /> }
  ] as const;

  return (
    <div className={s.root}>
      {items.map(
        ({ key, entry, icon }) =>
          entry && (
            <div key={key} className={s.card} data-kind={key}>
              <span className={s.label}>
                {icon}
                {t(key)}
              </span>
              <TankIdentity tank={vehicleIdentity(entry.vehicle)} />
              <div className={s.stats}>
                <RatingBadge label='WN8' size='sm' tone={ratingValueTone(entry.stats.wn8)} value={format.number(entry.stats.wn8.value ?? 0)} />
                <span className={s.muted}>{t('battlesCount', { count: entry.stats.battles })}</span>
                <span className={s.muted}>{t('avgDamageShort', { value: format.number(entry.stats.avgDamage ?? 0) })}</span>
              </div>
            </div>
          )
      )}
    </div>
  );
};
