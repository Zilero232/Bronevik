'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';

import { HEAD_REVEAL, REVEAL_VIEWPORT, STAGGER, stencilIndex } from '@/shared/lib';

import type { SectionHeaderProps } from './SectionHeader.types';

import s from './SectionHeader.module.scss';

export const SectionHeader = ({ index, eyebrow, title, description, action, className }: SectionHeaderProps) => (
  <motion.header className={clsx(s.root, className)} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
    <motion.div className={s.rule} variants={HEAD_REVEAL}>
      {index && <span className={s.index}>{stencilIndex(index)}</span>}
      {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
      <span aria-hidden className={s.ticks} />
    </motion.div>
    <div className={s.body}>
      <div className={s.text}>
        <motion.h2 className={s.title} variants={HEAD_REVEAL}>
          {title}
        </motion.h2>
        {description && (
          <motion.p className={s.description} variants={HEAD_REVEAL}>
            {description}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div className={s.action} variants={HEAD_REVEAL}>
          {action}
        </motion.div>
      )}
    </div>
  </motion.header>
);
