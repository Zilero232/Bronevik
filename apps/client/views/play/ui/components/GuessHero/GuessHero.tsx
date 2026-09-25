'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER } from '@/shared/lib';

import s from './GuessHero.module.scss';

const LEGEND = ['match', 'close', 'miss'] as const;

export const GuessHero = () => {
  const t = useTranslations('play.hero');

  return (
    <section className={s.root}>
      <div aria-hidden className={s.backdrop} />
      <motion.div animate='visible' className={s.inner} initial='hidden' variants={STAGGER}>
        <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
          <span className={s.blip} />
          {t('eyebrow')}
        </motion.span>
        <motion.h1 className={s.title} variants={HEAD_REVEAL}>
          {t.rich('title', { hot: (chunks) => <span className={s.hot}>{chunks}</span> })}
        </motion.h1>
        <motion.p className={s.lead} variants={HEAD_REVEAL}>
          {t('lead')}
        </motion.p>
        <motion.ul aria-label={t('legendLabel')} className={s.legend} variants={HEAD_REVEAL}>
          {LEGEND.map((verdict) => (
            <li key={verdict} className={s.legendItem}>
              <span aria-hidden className={s.swatch} data-verdict={verdict} />
              {t(`legend.${verdict}`)}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
};
