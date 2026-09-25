'use client';

import { ParentSize } from '@visx/responsive';
import { clsx } from 'clsx';

import type { ChartFrameProps } from './ChartFrame.types';

import s from '../../ChartKit.module.scss';

export const ChartFrame = ({ height, ariaLabel, className, children }: ChartFrameProps) => (
  <div aria-label={ariaLabel} className={clsx(s.frame, className)} role='img' style={{ height }}>
    <ParentSize debounceTime={40}>{({ width }) => width > 0 && children(width)}</ParentSize>
  </div>
);
