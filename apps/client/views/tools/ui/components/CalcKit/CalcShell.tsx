'use client';

import { motion } from 'motion/react';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import type { CalcShellProps } from './CalcKit.types';

import s from './CalcKit.module.scss';

export const CalcShell = ({ title, description, inputs, results, footer }: CalcShellProps) => (
  <motion.div animate='visible' className={s.shell} initial='hidden' variants={STAGGER}>
    <motion.header className={s.head} variants={STAGGER_ITEM}>
      <h2 className={s.title}>{title}</h2>
      {description && <p className={s.description}>{description}</p>}
    </motion.header>
    <div className={s.body}>
      <motion.div className={s.inputs} variants={STAGGER_ITEM}>
        {inputs}
      </motion.div>
      <motion.div aria-live='polite' className={s.readout} variants={STAGGER_ITEM}>
        <span aria-hidden className={s.scan} />
        {results}
      </motion.div>
    </div>
    {footer && (
      <motion.div className={s.footer} variants={STAGGER_ITEM}>
        {footer}
      </motion.div>
    )}
  </motion.div>
);
