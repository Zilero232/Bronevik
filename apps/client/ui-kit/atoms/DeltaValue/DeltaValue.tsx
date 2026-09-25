'use client';

import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { useFormatter } from 'next-intl';

import { POPUP } from '@/shared/lib';

import type { DeltaValueProps } from './DeltaValue.types';

import s from './DeltaValue.module.scss';

export const DeltaValue = ({ value, verdict, format, suffix = '', className }: DeltaValueProps) => {
  const formatter = useFormatter();

  const text = `${formatter.number(value, { signDisplay: 'exceptZero', maximumFractionDigits: 2, ...format })}${suffix}`;

  return (
    <span className={clsx(s.root, className)} data-verdict={verdict}>
      <AnimatePresence initial={false} mode='popLayout'>
        <motion.span key={text} animate='visible' className={s.value} exit='exit' initial='hidden' variants={POPUP}>
          {verdict !== 'same' && text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
