'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER } from '@/shared/lib';

import { CALCULATOR_IDS, GOLD } from '../../../config';

import s from './ToolsHero.module.scss';

export const ToolsHero = () => {
  const t = useTranslations('tools.hero');
  const format = useFormatter();

  const readouts = [
    { key: 'count', value: format.number(CALCULATOR_IDS.length), label: t('count') },
    { key: 'rate', value: `1 : ${format.number(GOLD.creditsPerGold)}`, label: t('rate') },
    { key: 'xp', value: `1 : ${format.number(GOLD.xpPerGold)}`, label: t('xpRate') }
  ];

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
        <motion.dl className={s.readouts} variants={HEAD_REVEAL}>
          {readouts.map(({ key, value, label }) => (
            <div key={key} className={s.readout}>
              <dt className={s.readoutLabel}>{label}</dt>
              <dd className={s.readoutValue}>{value}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
};
