'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { HEAD_REVEAL, SCALE_IN, STAGGER } from '@/shared/lib';

import { PLUS_BENEFITS, PLUS_CHECKOUT, PLUS_HERO } from '../../../config';
import { PlusEmblem } from '../PlusEmblem';

import s from './PlusHero.module.scss';

export const PlusHero = () => {
  const t = useTranslations('plus.hero');

  return (
    <section className={s.root}>
      <div aria-hidden className={s.backdrop} />
      <div className={s.inner}>
        <motion.div animate='visible' className={s.text} initial='hidden' variants={STAGGER}>
          <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
            {t('eyebrow')}
          </motion.span>
          <motion.h1 className={s.title} variants={HEAD_REVEAL}>
            {t.rich('title', { gold: (chunks) => <span className={s.gold}>{chunks}</span> })}
          </motion.h1>
          <motion.p className={s.lead} variants={HEAD_REVEAL}>
            {t('lead', { count: PLUS_BENEFITS.length })}
          </motion.p>
          <motion.ul className={s.perks} variants={HEAD_REVEAL}>
            {PLUS_HERO.perks.map((perk) => (
              <li key={perk} className={s.perk}>
                {t(`perks.${perk}`)}
              </li>
            ))}
          </motion.ul>
          <motion.a className={s.jump} href={`#${PLUS_CHECKOUT.anchor}`} variants={HEAD_REVEAL}>
            {t('jump')}
          </motion.a>
        </motion.div>
        <motion.div animate='visible' className={s.emblem} initial='hidden' variants={SCALE_IN}>
          <span aria-hidden className={s.halo} />
          <PlusEmblem />
        </motion.div>
      </div>
    </section>
  );
};
