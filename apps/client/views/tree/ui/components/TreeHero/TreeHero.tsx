'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER } from '@/shared/lib';

import { NationSelector } from '../NationSelector';

import s from './TreeHero.module.scss';

export const TreeHero = () => {
  const t = useTranslations('tree.hero');

  return (
    <section className={s.root}>
      <div aria-hidden className={s.backdrop} />
      <motion.div animate='visible' className={s.inner} initial='hidden' variants={STAGGER}>
        <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
          {t('eyebrow')}
        </motion.span>
        <motion.h1 className={s.title} variants={HEAD_REVEAL}>
          {t.rich('title', { hot: (chunks) => <span className={s.hot}>{chunks}</span> })}
        </motion.h1>
        <motion.p className={s.lead} variants={HEAD_REVEAL}>
          {t('lead')}
        </motion.p>
        <motion.div variants={HEAD_REVEAL}>
          <NationSelector />
        </motion.div>
      </motion.div>
    </section>
  );
};
