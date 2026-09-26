'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ChannelChip, LivePill } from '@/entities/streamer/channel';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Avatar } from '@/ui-kit';

import type { StreamerCardProps } from './StreamerCard.types';

import { DIRECTORY } from '../../../config';
import { CardStats, FavouriteTanks } from './components';

import s from './StreamerCard.module.scss';

export const StreamerCard = ({ entry }: StreamerCardProps) => {
  const t = useTranslations('streamersDirectory.card');
  const { card, channels, favourites, stats } = entry;

  return (
    <li className={s.root} data-live={card.live !== null}>
      <div className={s.head}>
        <Avatar name={card.displayName} size='md' />
        <div className={s.names}>
          <Link className={s.name} href={ROUTES.streamers.profile(card.slug)}>
            {card.displayName}
          </Link>
          {card.live ? <LivePill live={card.live} /> : <span className={s.offline}>{t('offline')}</span>}
        </div>
      </div>
      {channels.length > 0 && (
        <ul aria-label={t('channels')} className={s.channels}>
          {channels.map((channel) => (
            <li key={channel.url}>
              <ChannelChip isCompact channel={channel} />
            </li>
          ))}
        </ul>
      )}
      <CardStats marks3={card.marks3} stats={stats} />
      {favourites.length > 0 && <FavouriteTanks favourites={favourites} />}
      {card.hasSettings && (
        <Link className={s.settings} href={ROUTES.streamers.settings.profile(card.slug)}>
          <SlidersHorizontal aria-hidden size={DIRECTORY.iconSize} />
          {t('hasSettings')}
        </Link>
      )}
    </li>
  );
};
