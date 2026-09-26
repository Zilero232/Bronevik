'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone } from '@/entities/player/stats';
import { RatingBadge, Skeleton } from '@/ui-kit';

import type { PlayerHeaderProps } from './PlayerHeader.types';

import s from './PlayerHeader.module.scss';

export const PlayerHeader = ({ nickname, summary }: PlayerHeaderProps) => {
  const t = useTranslations('tg.header');
  const format = useFormatter();

  const wn8 = summary?.overall.wn8;
  const clan = summary?.clan;

  return (
    <header className={s.root}>
      <div className={s.identity}>
        <h1 className={s.nickname}>{nickname}</h1>
        <span className={s.clan}>{clan ? `[${clan.tag}] ${clan.name}` : t('noClan')}</span>
      </div>
      {wn8 ? (
        <RatingBadge label='WN8' size='lg' tone={ratingValueTone(wn8)} value={wn8.value === null ? '—' : format.number(Math.round(wn8.value))} />
      ) : (
        <Skeleton height={48} shape='block' width={96} />
      )}
    </header>
  );
};
