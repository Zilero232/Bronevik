'use client';

import { NationFlag, TANK_CLASS_SILHOUETTES, toRoman } from '@bronevik/icons';
import { motion } from 'motion/react';

import { useTank } from '../../../../../model/context';
import { SILHOUETTE_MOTION, WATERMARK_MOTION } from './HeroBackdrop.motion';

import s from './HeroBackdrop.module.scss';

export const HeroBackdrop = () => {
  const { identity } = useTank();

  const Silhouette = TANK_CLASS_SILHOUETTES[identity.type];

  return (
    <div aria-hidden className={s.root}>
      <NationFlag className={s.flag} nation={identity.nation} />
      <span className={s.grid} />
      <span className={s.glow} />
      <motion.span className={s.watermark} {...WATERMARK_MOTION}>
        {toRoman(identity.tier)}
      </motion.span>
      <motion.span className={s.silhouette} {...SILHOUETTE_MOTION}>
        <Silhouette size='100%' strokeWidth={0.6} />
      </motion.span>
      <span className={s.scan} />
    </div>
  );
};
