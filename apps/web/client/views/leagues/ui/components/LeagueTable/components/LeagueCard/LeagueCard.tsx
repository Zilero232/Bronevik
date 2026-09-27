'use client';

import { useTranslations } from 'next-intl';

import { PlayerNameCell } from '@/entities/player/player';

import type { LeagueCardProps } from './LeagueCard.types';

import { TierBadge } from '../../../TierBadge';
import { RankCell } from '../RankCell';
import { ValueCell } from '../ValueCell';

import s from './LeagueCard.module.scss';

export const LeagueCard = ({ row, metric, showTier }: LeagueCardProps) => {
  const t = useTranslations('social.leagues');

  return (
    <article className={s.root} data-me={row.isMe} data-zone={row.zone ?? 'stay'}>
      <RankCell row={row} />
      <div className={s.player}>
        {row.nickname ? <PlayerNameCell nickname={row.nickname} withAvatar={false} /> : t('unknownPlayer', { id: row.accountId })}
        <span className={s.meta}>
          {t('battlesCount', { count: row.battles })}
          {showTier && row.tier && <TierBadge tier={row.tier} />}
        </span>
      </div>
      <ValueCell metric={metric} value={row.value} />
    </article>
  );
};
