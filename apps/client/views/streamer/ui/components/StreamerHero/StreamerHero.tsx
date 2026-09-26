'use client';

import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { Avatar } from '@/ui-kit';

import type { StreamerHeroProps } from './StreamerHero.types';

import { StreamerLinks } from '../StreamerLinks';

import s from './StreamerHero.module.scss';

export const StreamerHero = ({ profile }: StreamerHeroProps) => {
  const t = useTranslations('streamer.page');
  const { displayName, slug, bio, links, isLive } = profile;

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
        </div>
      </div>
      {bio && <p className={s.bio}>{bio}</p>}
      <div>
        <StreamerLinks links={links} />
      </div>
    </section>
  );
};
