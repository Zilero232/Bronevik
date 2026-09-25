'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';

import type { LiveLampProps } from './LiveLamp.types';

import { LAMP_PULSE } from './LiveLamp.motion';

import s from './LiveLamp.module.scss';

export const LiveLamp = ({ label, isLive = true, size = 'md', className }: LiveLampProps) => (
  <span className={clsx(s.root, s[size], className)} data-live={isLive}>
    <motion.span aria-hidden animate={isLive ? LAMP_PULSE.animate : undefined} className={s.dot} transition={LAMP_PULSE.transition} />
    {label}
  </span>
);
