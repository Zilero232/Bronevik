'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';

import { HEAD_REVEAL, SLIDE_UP, STAGGER, stencilIndex } from '@/shared/lib';

import type { PageHeroProps } from './PageHero.types';

import s from './PageHero.module.scss';

export const PageHero = ({ eyebrow, title, index, description, watermark, aside, children, className }: PageHeroProps) => (
  <motion.header animate='visible' className={clsx(s.root, className)} initial='hidden' variants={STAGGER}>
    <span aria-hidden className={s.grid} />
    {watermark && (
      <span aria-hidden className={s.watermark}>
        {watermark}
      </span>
    )}
    <div className={s.copy}>
      <motion.div className={s.rule} variants={HEAD_REVEAL}>
        {index && <span className={s.index}>{stencilIndex(index)}</span>}
        <span className={s.eyebrow}>{eyebrow}</span>
        <span aria-hidden className={s.line} />
      </motion.div>
      <motion.h1 className={s.title} variants={HEAD_REVEAL}>
        {title}
      </motion.h1>
      {description && (
        <motion.p className={s.description} variants={HEAD_REVEAL}>
          {description}
        </motion.p>
      )}
      {children && (
        <motion.div className={s.actions} variants={SLIDE_UP}>
          {children}
        </motion.div>
      )}
    </div>
    {aside && (
      <motion.div className={s.aside} variants={SLIDE_UP}>
        {aside}
      </motion.div>
    )}
  </motion.header>
);
