'use client';

import { Progress } from '@base-ui/react/progress';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { clamp } from 'remeda';

import { EASE_OUT, REVEAL_VIEWPORT } from '@/shared/lib';

import type { ProgressBarProps } from './ProgressBar.types';

import s from './ProgressBar.module.scss';

export const ProgressBar = ({ value, max = 100, label, valueLabel, tone = 'accent', size = 'md', className }: ProgressBarProps) => {
  const ratio = clamp(value / max, { min: 0, max: 1 });

  return (
    <Progress.Root className={clsx(s.root, s[size], className)} data-tone={tone} max={max} value={value}>
      {(label || valueLabel) && (
        <div className={s.head}>
          {label && <Progress.Label className={s.label}>{label}</Progress.Label>}
          {valueLabel && <span className={s.value}>{valueLabel}</span>}
        </div>
      )}
      <Progress.Track className={s.track}>
        <motion.span
          className={s.fill}
          initial={{ scaleX: 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
          viewport={REVEAL_VIEWPORT}
          whileInView={{ scaleX: ratio }}
        />
        <span aria-hidden className={s.ticks} />
      </Progress.Track>
    </Progress.Root>
  );
};
