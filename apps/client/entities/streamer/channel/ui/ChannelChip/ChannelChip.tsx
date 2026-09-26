'use client';

import { clsx } from 'clsx';
import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ChannelChipProps } from './ChannelChip.types';

import { CHANNEL_CHIP, PLATFORM_ICONS } from '../../config';

import s from './ChannelChip.module.scss';

export const ChannelChip = ({ channel, isCompact = false, className }: ChannelChipProps) => {
  const t = useTranslations('streamersDirectory.channel');
  const Icon = PLATFORM_ICONS[channel.platform];
  const platform = t(`platforms.${channel.platform}`);

  return (
    <a
      className={clsx(s.root, className)}
      data-compact={isCompact}
      href={channel.url}
      rel='noopener noreferrer me'
      target='_blank'
      title={`${platform} · ${channel.handle}`}
    >
      <Icon aria-hidden size={CHANNEL_CHIP.iconSize} />
      <span className={isCompact ? s.hidden : s.label}>{platform}</span>
      {channel.verified && <BadgeCheck aria-label={t('verified')} className={s.verified} size={CHANNEL_CHIP.verifiedSize} />}
    </a>
  );
};
