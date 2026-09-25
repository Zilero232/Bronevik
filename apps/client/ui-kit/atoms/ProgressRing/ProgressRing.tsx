'use client';

import { Progress } from '@base-ui/react/progress';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { clamp } from 'remeda';

import { EASE_OUT, REVEAL_VIEWPORT } from '@/shared/lib';

import type { ProgressRingProps } from './ProgressRing.types';

import s from './ProgressRing.module.scss';

const TICKS = Array.from({ length: 24 }, (_, index) => index * 15);

export const ProgressRing = ({ value, max = 100, size = 96, thickness = 6, tone = 'accent', label, children, className }: ProgressRingProps) => {
  const ratio = clamp(value / max, { min: 0, max: 1 });
  const radius = (size - thickness) / 2 - 4;
  const center = size / 2;

  return (
    <Progress.Root
      aria-label={label}
      className={clsx(s.root, className)}
      data-tone={tone}
      max={max}
      style={{ width: size, height: size }}
      value={value}
    >
      <svg aria-hidden className={s.svg} height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        {TICKS.map((angle) => (
          <line
            key={angle}
            className={s.tick}
            transform={`rotate(${angle} ${center} ${center})`}
            x1={center}
            x2={center}
            y1={1}
            y2={angle % 90 === 0 ? 5 : 3}
          />
        ))}
        <circle className={s.track} cx={center} cy={center} r={radius} strokeWidth={thickness} />
        <motion.circle
          className={s.indicator}
          cx={center}
          cy={center}
          initial={{ pathLength: 0 }}
          r={radius}
          strokeWidth={thickness}
          transform={`rotate(-90 ${center} ${center})`}
          transition={{ duration: 1.3, ease: EASE_OUT }}
          viewport={REVEAL_VIEWPORT}
          whileInView={{ pathLength: ratio }}
        />
      </svg>
      <div className={s.content}>{children}</div>
    </Progress.Root>
  );
};
