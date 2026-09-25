'use client';

import { motion } from 'motion/react';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import { HeroActions, HeroIdentity, HeroPeriod, HeroRatings } from './components';

import s from './ProfileHero.module.scss';

export const ProfileHero = () => (
  <motion.section animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
    <div aria-hidden className={s.grid} />
    <div className={s.body}>
      <motion.div className={s.left} variants={STAGGER_ITEM}>
        <HeroIdentity />
        <HeroActions />
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <HeroRatings />
      </motion.div>
    </div>
    <motion.div className={s.foot} variants={STAGGER_ITEM}>
      <HeroPeriod />
    </motion.div>
  </motion.section>
);
