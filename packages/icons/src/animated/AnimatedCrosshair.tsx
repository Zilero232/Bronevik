'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { IconProps } from '../lib';

import { IconBase } from '../lib';
import { ACCENT, STAR_STYLE } from './animated.constants';

export const AnimatedCrosshair = (props: IconProps) => {
  const isReduced = useReducedMotion();

  return (
    <IconBase name='crosshair-animated' {...props}>
      <motion.g animate={isReduced ? undefined : { rotate: 360 }} style={STAR_STYLE} transition={{ duration: 12, ease: 'linear', repeat: Infinity }}>
        <circle cx='12' cy='12' r='8' strokeDasharray='9 3.57' />
      </motion.g>
      <motion.path
        animate={isReduced ? undefined : { scale: [1, 0.82, 1] }}
        d='M12 2v4M12 18v4M2 12h4M18 12h4'
        style={STAR_STYLE}
        transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.path
        animate={isReduced ? undefined : { opacity: [1, 0.35, 1] }}
        d='M12 12h.01'
        stroke={ACCENT}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </IconBase>
  );
};
