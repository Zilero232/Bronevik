'use client';

import { ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { LiveLamp } from '@/entities/streamer/broadcast';
import { HEAD_REVEAL, SCALE_IN, STAGGER } from '@/shared/lib';
import { buttonVariants } from '@/ui-kit';

import { LANDING_ANCHORS } from '../../../config';
import { OnAirMonitor } from '../OnAirMonitor';
import { StudioLink } from '../StudioLink';

import s from './StreamersHero.module.scss';

export const StreamersHero = () => {
  const t = useTranslations('streamers.hero');

  return (
    <section className={s.root}>
      <div aria-hidden className={s.backdrop} />
      <motion.div animate='visible' className={s.inner} initial='hidden' variants={STAGGER}>
        <div className={s.copy}>
          <motion.div className={s.signal} variants={HEAD_REVEAL}>
            <LiveLamp label={t('onAir')} />
            <span className={s.eyebrow}>{t('eyebrow')}</span>
          </motion.div>
          <motion.h1 className={s.title} variants={HEAD_REVEAL}>
            {t.rich('title', { hot: (chunks) => <span className={s.hot}>{chunks}</span> })}
          </motion.h1>
          <motion.p className={s.lead} variants={HEAD_REVEAL}>
            {t('lead')}
          </motion.p>
          <motion.div className={s.actions} variants={HEAD_REVEAL}>
            <StudioLink />
            <a className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={`#${LANDING_ANCHORS.flow}`}>
              {t('ctaHow')}
              <ArrowDown size={16} />
            </a>
          </motion.div>
        </div>
        <motion.div className={s.monitor} variants={SCALE_IN}>
          <OnAirMonitor />
        </motion.div>
      </motion.div>
    </section>
  );
};
