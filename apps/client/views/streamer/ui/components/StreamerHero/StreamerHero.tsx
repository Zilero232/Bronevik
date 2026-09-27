'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { FollowStreamer } from '@/features/streamer/follow-streamer';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Avatar, buttonVariants } from '@/ui-kit';

import { STREAMER_PAGE } from '../../../config';
import { useStreamer } from '../../../model/context';
import { StreamerChannels } from '../StreamerChannels';
import { FollowExtras } from './components';

import s from './StreamerHero.module.scss';

export const StreamerHero = () => {
  const t = useTranslations('streamer.page');
  const tPublic = useTranslations('streamersDirectory.public');
  const { profile, channels } = useStreamer();
  const { displayName, slug, bio, isLive, followers, hasSettings } = profile;

  return (
    <section className={s.root} data-live={isLive}>
      <div className={s.top}>
        <LiveLamp isLive={isLive} label={isLive ? t('live') : t('offline')} />
        <span className={s.eyebrow}>{t('eyebrow')}</span>
      </div>
      <div className={s.identity}>
        <Avatar name={displayName} size='lg' />
        <div className={s.names}>
          <h1 className={s.title}>{displayName}</h1>
          <span className={s.slug}>@{slug}</span>
          <span className={s.followers}>{tPublic('followers', { count: followers })}</span>
        </div>
      </div>
      {bio && <p className={s.bio}>{bio}</p>}
      <StreamerChannels channels={channels} />
      <div className={s.actions}>
        <FollowStreamer renderExtras={(state) => <FollowExtras state={state} />} slug={slug} />
        {hasSettings && (
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.streamers.settings.profile(slug)}>
            <SlidersHorizontal size={STREAMER_PAGE.iconSize} />
            {tPublic('settings')}
          </Link>
        )}
      </div>
    </section>
  );
};
