'use client';

import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { IconButton, LiveLamp } from '@/ui-kit';

import type { MyFollowsStripProps } from './MyFollowsStrip.types';

import { FOLLOW_STREAMER } from '../../config';
import { useMyFollows } from '../../model/hooks';

import s from './MyFollowsStrip.module.scss';

export const MyFollowsStrip = ({ className }: MyFollowsStripProps) => {
  const t = useTranslations('streamersDirectory.follows');
  const { isVisible, follows, pendingSlug, onUnfollow } = useMyFollows();

  if (!isVisible) {
    return null;
  }

  return (
    <section aria-label={t('title')} className={clsx(s.root, className)}>
      <span className={s.title}>{t('title')}</span>
      <ul className={s.list}>
        {follows.map(({ slug, displayName, isLive }) => (
          <li key={slug} className={s.item} data-live={isLive}>
            <Link className={s.link} href={ROUTES.streamers.profile(slug)}>
              <LiveLamp isLive={isLive} label={displayName} size='sm' />
            </Link>
            <IconButton
              aria-label={t('unfollow', { name: displayName })}
              disabled={pendingSlug === slug}
              size='sm'
              variant='ghost'
              onClick={() => onUnfollow(slug)}
            >
              <X size={FOLLOW_STREAMER.iconSize} />
            </IconButton>
          </li>
        ))}
      </ul>
    </section>
  );
};
