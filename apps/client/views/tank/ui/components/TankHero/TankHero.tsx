'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage } from '@/entities/tank/tank';
import { HEAD_REVEAL, STAGGER } from '@/shared/lib';

import { useTank } from '../../../model/context';
import { HeroActions, HeroBackdrop, HeroMeta, HeroSpecs } from './components';

import s from './TankHero.module.scss';

export const TankHero = () => {
  const t = useTranslations('tank.hero');
  const { detail, identity } = useTank();

  const { vehicle, description } = detail;

  return (
    <section aria-labelledby='tank-hero-title' className={s.root} data-premium={identity.isPremium}>
      <HeroBackdrop />
      <div className={s.inner}>
        <motion.div animate='visible' className={s.copy} initial='hidden' variants={STAGGER}>
          <motion.span className={s.eyebrow} variants={HEAD_REVEAL}>
            <span aria-hidden className={s.pulse} />
            {t('eyebrow')}
          </motion.span>
          <motion.div className={s.plate} variants={HEAD_REVEAL}>
            <span className={s.photo}>
              <TankImage isPriority size='big' tank={identity} />
            </span>
            <TankIdentity className={s.identity} size='lg' tank={identity} />
          </motion.div>
          <motion.h1 className={s.title} id='tank-hero-title' variants={HEAD_REVEAL}>
            {vehicle.name}
          </motion.h1>
          <motion.div variants={HEAD_REVEAL}>
            <HeroMeta />
          </motion.div>
          {description && (
            <motion.p className={s.description} variants={HEAD_REVEAL}>
              {description}
            </motion.p>
          )}
          <motion.div variants={HEAD_REVEAL}>
            <HeroActions />
          </motion.div>
        </motion.div>
        <HeroSpecs />
      </div>
    </section>
  );
};
