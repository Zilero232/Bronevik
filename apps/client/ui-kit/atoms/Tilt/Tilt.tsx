'use client';

import { clsx } from 'clsx';

import { TILT_HANDLERS } from '@/shared/lib';

import type { TiltProps } from './Tilt.types';

import s from './Tilt.module.scss';

export const Tilt = ({ children, className }: TiltProps) => (
  <div className={clsx(s.root, className)} {...TILT_HANDLERS}>
    {children}
  </div>
);
