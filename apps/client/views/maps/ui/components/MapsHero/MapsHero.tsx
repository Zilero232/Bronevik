'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { HEAD_REVEAL, STAGGER, STAGGER_ITEM } from '@/shared/lib';

import type { MapsHeroProps } from './MapsHero.types';

import s from './MapsHero.module.scss';

export const MapsHero = ({ total }: MapsHeroProps) => {
  const t = useTranslations('maps.hero');

  return (
    <motion.header animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <div aria-hidden className={s.radar}>
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
        {total > 0 && (
          <motion.span className={s.count} variants={STAGGER_ITEM}>
            {t('count', { count: total })}
          </motion.span>
        )}
      </div>
    </motion.header>
  );
};
