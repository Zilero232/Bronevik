import { MOE, moeMarks } from '@otmetki/ratings';
import { clsx } from 'clsx';

import { ringNotches } from '@/shared/lib';

import type { MarksRingProps } from './MarksRing.types';

import { ProgressRing } from '../../atoms';
import { MARKS_RING } from './MarksRing.constants';

import s from './MarksRing.module.scss';

export const MarksRing = ({ percent, label, size = 64, thickness = 5, children, className }: MarksRingProps) => (
  <div className={clsx(s.root, className)} style={{ width: size, height: size }}>
    <ProgressRing
      label={label}
      marks={MARKS_RING.levels[moeMarks(percent)] ?? 0}
      max={MOE.maxPercent}
      size={size}
      thickness={thickness}
      value={percent}
    >
      {children}
    </ProgressRing>
    <svg aria-hidden className={s.notches} height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      {ringNotches({ size, thickness, percents: MOE.markPercents }).map((notch) => (
        <line key={notch.percent} data-passed={percent >= notch.percent} x1={notch.x1} x2={notch.x2} y1={notch.y1} y2={notch.y2} />
      ))}
    </svg>
  </div>
);
