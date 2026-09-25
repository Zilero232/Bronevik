'use client';

import { motion } from 'motion/react';

import { REVEAL_VIEWPORT } from '@/shared/lib';

import type { LevelPipsProps } from './LevelPips.types';

import s from './LevelPips.module.scss';

export const LevelPips = ({ level, max, label }: LevelPipsProps) => (
  <span aria-label={label} className={s.root} role='img'>
    {Array.from({ length: max }, (_, index) => (
      <motion.span
        key={index}
        className={s.pip}
        data-on={index < level}
        initial={{ opacity: 0, scaleY: 0.3 }}
        style={{ skewX: -14 }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
        viewport={REVEAL_VIEWPORT}
        whileInView={{ opacity: 1, scaleY: 1 }}
      />
    ))}
  </span>
);
