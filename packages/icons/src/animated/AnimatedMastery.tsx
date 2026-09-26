'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { AnimatedMasteryProps } from './animated.types';

import { MASTERY, MASTERY_EMBLEM, MASTERY_TINTS } from '../icons/mastery.shapes';
import { IconBase } from '../lib';
import { ACCENT, DRAW, ICON_EASE, STAR_STYLE } from './animated.constants';

export const AnimatedMastery = ({ level, tinted = false, color, style, ...props }: AnimatedMasteryProps) => {
  const isReduced = useReducedMotion();
  const initial = isReduced ? false : 'hidden';
  const tint = tinted ? MASTERY_TINTS[level] : undefined;

  return (
    <IconBase
      color={tint ?? color}
      name={`mastery-${level}-animated`}
      style={tinted && level === 'master' ? { filter: MASTERY.glow, ...style } : style}
      {...props}
    >
      <motion.path
        animate='visible'
        d={MASTERY.shield}
        fill={tint}
        fillOpacity={tint ? MASTERY.fillOpacity : undefined}
        initial={initial}
        transition={{ duration: 0.9, ease: ICON_EASE }}
        variants={DRAW}
      />
      {MASTERY_EMBLEM[level].map((d, index) => (
        <motion.path
          key={d}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          d={d}
          initial={isReduced ? false : { opacity: 0, y: -4, scale: 0.6 }}
          stroke={level === 'master' && !tint ? ACCENT : undefined}
          style={STAR_STYLE}
          transition={{ duration: 0.45, delay: 0.55 + index * 0.14, ease: ICON_EASE }}
        />
      ))}
    </IconBase>
  );
};
