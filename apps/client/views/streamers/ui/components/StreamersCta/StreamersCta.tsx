'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { REVEAL_VIEWPORT, SCALE_IN } from '@/shared/lib';

import { StudioLink } from '../StudioLink';

import s from './StreamersCta.module.scss';

export const StreamersCta = () => {
  const t = useTranslations('streamers');

  return (
    <motion.section className={s.root} initial='hidden' variants={SCALE_IN} viewport={REVEAL_VIEWPORT} whileInView='visible'>
      <div className={s.plate}>
        <LiveLamp label={t('hero.onAir')} size='sm' />
        <h2 className={s.title}>{t('cta.title')}</h2>
        <p className={s.text}>{t('cta.text')}</p>
        <StudioLink />
      </div>
    </motion.section>
  );
};
