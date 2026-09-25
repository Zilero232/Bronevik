'use client';

import { motion } from 'motion/react';

import { STAGGER } from '@/shared/lib';

import type { TierBandProps } from './TierBand.types';

import { TierCard } from '../TierCard';

import s from './TierBand.module.scss';

export const TierBand = ({ group }: TierBandProps) => (
  <motion.div layout className={s.root} data-rank={group.rank}>
    <div aria-hidden className={s.rank}>
      {group.rank}
    </div>
    <motion.ul animate='visible' className={s.cards} initial='hidden' variants={STAGGER}>
      {group.entries.map((entry) => (
        <TierCard key={entry.vehicle.tankId} entry={entry} />
      ))}
    </motion.ul>
  </motion.div>
);
