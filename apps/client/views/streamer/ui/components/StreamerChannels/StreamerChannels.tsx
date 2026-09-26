'use client';

import { useTranslations } from 'next-intl';

import { ChannelChip } from '@/entities/streamer/channel';

import type { StreamerChannelsProps } from './StreamerChannels.types';

import s from './StreamerChannels.module.scss';

export const StreamerChannels = ({ channels }: StreamerChannelsProps) => {
  const t = useTranslations('streamersDirectory.public');

  if (channels.length === 0) {
    return null;
  }

  return (
    <nav aria-label={t('channels')} className={s.root}>
      <span className={s.label}>{t('channels')}</span>
      <ul className={s.list}>
        {channels.map((channel) => (
          <li key={channel.url}>
            <ChannelChip channel={channel} />
          </li>
        ))}
      </ul>
    </nav>
  );
};
