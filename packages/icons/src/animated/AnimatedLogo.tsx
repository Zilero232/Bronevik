'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { AnimatedLogoProps } from './animated.types';

import { LOGO_SHAPES } from '../icons/logo.shapes';
import { IconBase } from '../lib';
import { ACCENT, DRAW, ICON_EASE } from './animated.constants';

export const AnimatedLogo = ({ withTracer = true, ...props }: AnimatedLogoProps) => {
  const isReduced = useReducedMotion();

  return (
    <IconBase name='bronevik-logo-animated' {...props}>
      <motion.path
        animate='visible'
        d={LOGO_SHAPES.plate}
        initial={isReduced ? false : 'hidden'}
        transition={{ duration: 1.1, ease: ICON_EASE }}
        variants={DRAW}
      />
      <motion.path
        animate='visible'
        d={LOGO_SHAPES.letter}
        initial={isReduced ? false : 'hidden'}
        transition={{ duration: 0.8, delay: 0.55, ease: ICON_EASE }}
        variants={DRAW}
      />
      {withTracer && !isReduced && (
        <motion.path
          animate={{ pathOffset: [0, 1], opacity: [0, 1, 1, 0] }}
          d={LOGO_SHAPES.plate}
          initial={{ pathLength: 0.14, pathOffset: 0, opacity: 0 }}
          stroke={ACCENT}
          transition={{ duration: 1.6, delay: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4.5 }}
        />
      )}
    </IconBase>
  );
};
