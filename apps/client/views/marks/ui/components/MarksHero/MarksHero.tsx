'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER } from '@/shared/lib';
import { AnimatedNumber, Skeleton } from '@/ui-kit';

import type { MarksHeroProps } from './MarksHero.types';

import { BarrelRuler } from './components';

import s from './MarksHero.module.scss';

export const MarksHero = ({ total, updatedAt, isLoading }: MarksHeroProps) => {
  const t = useTranslations('marks.hero');
  const format = useFormatter();

  const updated = updatedAt ? format.dateTime(new Date(updatedAt), { dateStyle: 'medium' }) : t('updatedUnknown');

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
          <BarrelRuler />
        </motion.div>
        <motion.dl className={s.counters} variants={HEAD_REVEAL}>
          <div className={s.counter}>
            <dt className={s.counterLabel}>{t('tracked')}</dt>
            <dd className={s.counterValue}>{isLoading ? <Skeleton height={32} width={80} /> : <AnimatedNumber value={total} />}</dd>
          </div>
          <div className={s.counter}>
            <dt className={s.counterLabel}>{t('updated')}</dt>
            <dd className={s.counterValue}>{isLoading ? <Skeleton height={32} width={140} /> : updated}</dd>
          </div>
          <div className={s.counter}>
            <dt className={s.counterLabel}>{t('window')}</dt>
            <dd className={s.counterValue}>{t('windowValue')}</dd>
          </div>
        </motion.dl>
      </motion.div>
    </section>
  );
};
