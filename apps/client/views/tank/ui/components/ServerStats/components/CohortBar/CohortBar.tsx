'use client';

import { motion } from 'motion/react';

import { REVEAL_VIEWPORT } from '@/shared/lib';

import type { CohortBarProps } from './CohortBar.types';

import { BAR_TRANSITION } from './CohortBar.motion';

import s from './CohortBar.module.scss';

export const CohortBar = ({ label, value, share, tone }: CohortBarProps) => (
  <div className={s.root} data-tone={tone}>
    <span className={s.label}>{label}</span>
    <span className={s.track}>
      <motion.span
        className={s.fill}
        initial={{ scaleX: 0 }}
        transition={BAR_TRANSITION}
        viewport={REVEAL_VIEWPORT}
        whileInView={{ scaleX: share }}
      />
    </span>
    <span className={s.value}>{value}</span>
  </div>
);
