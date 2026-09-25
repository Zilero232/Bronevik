'use client';

import { StrongholdIcon } from '@bronevik/icons';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER, STAGGER_ITEM } from '@/shared/lib';

import { ClanSearch } from '../ClanSearch';

import s from './ClansHero.module.scss';

export const ClansHero = () => {
  const t = useTranslations('clans.hero');

  return (
    <motion.header animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <div aria-hidden className={s.backdrop}>
        <StrongholdIcon className={s.emblem} size={420} />
        <span className={s.sweep} />
      </div>
      <div className={s.inner}>
        <motion.span className={s.eyebrow} variants={STAGGER_ITEM}>
          {t('eyebrow')}
        </motion.span>
        <motion.h1 className={s.title} variants={HEAD_REVEAL}>
          {t('title')}
        </motion.h1>
        <motion.p className={s.description} variants={STAGGER_ITEM}>
          {t('description')}
        </motion.p>
        <motion.div variants={STAGGER_ITEM}>
          <ClanSearch />
        </motion.div>
      </div>
    </motion.header>
  );
};
