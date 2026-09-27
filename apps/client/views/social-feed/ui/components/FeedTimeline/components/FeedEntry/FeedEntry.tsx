'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { PlayerNameCell } from '@/entities/player/player';
import { useChallengeTitle } from '@/entities/social/challenge';
import { TankLink } from '@/entities/tank/tank';
import { DeltaValue } from '@/ui-kit';

import type { FeedEntryProps } from './FeedEntry.types';

import { feedGain } from '../../../../../lib/feed-groups';

import s from './FeedEntry.module.scss';

export const FeedEntry = ({ item, vehicle }: FeedEntryProps) => {
  const t = useTranslations('social.feed.entry');
  const titleOf = useChallengeTitle();
  const gain = feedGain(item);

  return (
    <div className={s.root} data-kind={item.kind}>
      <div className={s.head}>
        {item.nickname ? <PlayerNameCell nickname={item.nickname} withAvatar={false} /> : <span className={s.unknown}>{t('unknown')}</span>}
        <span className={s.action}>
          {match(item)
            .with({ kind: 'mark' }, ({ value }) => t('mark', { value }))
            .with({ kind: 'mastery' }, () => t('mastery'))
            .with({ kind: 'record' }, ({ value }) => t('record', { value }))
            .with({ kind: 'badge' }, ({ badge }) => (badge?.challenge ? t('weeklyBadge', { title: titleOf(badge.challenge) }) : t('badge')))
            .exhaustive()}
        </span>
        {gain !== null && item.kind === 'record' && <DeltaValue format='integer' value={gain} />}
      </div>
      {vehicle && <TankLink className={s.tank} image='contour' vehicle={vehicle} />}
    </div>
  );
};
