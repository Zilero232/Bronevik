'use client';

import { useTranslations } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';

import type { MetricCardProps } from './MetricCard.types';

import { ValueCell } from '../ValueCell';

import s from './MetricCard.module.scss';

export const MetricCard = ({ row, players }: MetricCardProps) => {
  const t = useTranslations('compare.metrics');

  return (
    <div className={s.root}>
      <span className={s.metric}>{t(row.key)}</span>
      <dl className={s.values}>
        {players.map(({ accountId, nickname, clan }, index) => (
          <div key={accountId} className={s.entry}>
            <dt className={s.player}>
              <PlayerIdentity player={{ nickname, clanTag: clan?.tag ?? null }} />
            </dt>
            <dd className={s.value}>
              <ValueCell index={index} row={row} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
