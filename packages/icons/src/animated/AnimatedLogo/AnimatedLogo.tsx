'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { AnimatedLogoProps } from '../animated.types';

import { LOGO_SHAPES } from '../../icons';
import { IconBase } from '../../lib';
import { ACCENT, DRAW, ICON_EASE } from '../animated.constants';

export const AnimatedLogo = ({ withTracer = true, ...props }: AnimatedLogoProps) => {
  const isReduced = useReducedMotion();

  return (
    <IconBase name='otmetki-logo-animated' {...props}>
      {LOGO_SHAPES.marks.map((d, index) => (
        <motion.path
          key={d}
          animate='visible'
          d={d}
          initial={isReduced ? false : 'hidden'}
          transition={{ duration: 0.45, delay: index * 0.3, ease: ICON_EASE }}
          variants={DRAW}
        />
      ))}
      {withTracer && !isReduced && (
        <motion.path
          animate={{ pathOffset: [0, 1], opacity: [0, 1, 1, 0] }}
          d={LOGO_SHAPES.tracer}
          initial={{ pathLength: 0.14, pathOffset: 0, opacity: 0 }}
          stroke={ACCENT}
          transition={{ duration: 1.6, delay: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4.5 }}
        />
      )}
    </IconBase>
  );
};
