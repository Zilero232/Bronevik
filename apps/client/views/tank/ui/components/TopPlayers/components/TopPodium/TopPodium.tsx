'use client';

import { useTranslations } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { TopPodiumProps } from './TopPodium.types';

import s from './TopPodium.module.scss';

export const TopPodium = ({ rows, metricLabel }: TopPodiumProps) => {
  const t = useTranslations('tank.players');

  return (
    <ol aria-label={t('podiumLabel')} className={s.root}>
      {rows.map((row) => (
        <li key={row.key} className={s.item} data-rank={row.rank}>
          <Link className={s.card} href={ROUTES.players.profile(row.player.nickname)}>
            <span className={s.rank}>{row.rank}</span>
            <span className={s.player}>
              <PlayerIdentity player={row.player} />
            </span>
            <span className={s.metric} data-tone={row.tone}>
              {row.value}
            </span>
            <span className={s.meta}>
              <span>{metricLabel}</span>
              <span>{t('battles', { battles: row.battles })}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
};
