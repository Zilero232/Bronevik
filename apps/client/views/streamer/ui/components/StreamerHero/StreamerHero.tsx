'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { HEAD_REVEAL, STAGGER } from '@/shared/lib';
import { Avatar } from '@/ui-kit';

import type { StreamerHeroProps } from './StreamerHero.types';

import { StreamerLinks } from '../StreamerLinks';

import s from './StreamerHero.module.scss';

export const StreamerHero = ({ profile }: StreamerHeroProps) => {
  const t = useTranslations('streamer.page');
  const { displayName, slug, bio, links, isLive } = profile;

  return (
    <motion.section animate='visible' className={s.root} data-live={isLive} initial='hidden' variants={STAGGER}>
      <div aria-hidden className={s.scanlines} />
      <motion.div className={s.top} variants={HEAD_REVEAL}>
        <LiveLamp isLive={isLive} label={isLive ? t('live') : t('offline')} />
        <span className={s.eyebrow}>{t('eyebrow')}</span>
      </motion.div>
      <motion.div className={s.identity} variants={HEAD_REVEAL}>
        <Avatar name={displayName} size='lg' />
        <div className={s.names}>
          <h1 className={s.title}>{displayName}</h1>
          <span className={s.slug}>@{slug}</span>
        </div>
      </motion.div>
      {bio && (
        <motion.p className={s.bio} variants={HEAD_REVEAL}>
          {bio}
        </motion.p>
      )}
      <motion.div variants={HEAD_REVEAL}>
        <StreamerLinks links={links} />
      </motion.div>
    </motion.section>
  );
};
