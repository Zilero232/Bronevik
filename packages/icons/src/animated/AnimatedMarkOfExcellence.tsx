'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { AnimatedMarkOfExcellenceProps } from './animated.types';

import { MARK_SHAPES } from '../icons/marks.shapes';
import { IconBase } from '../lib';
import { ACCENT, DRAW, ICON_EASE, STAR_STYLE } from './animated.constants';

const STAR_DELAY = 0.7;

const STAR_STEP = 0.28;

export const AnimatedMarkOfExcellence = ({ marks, ...props }: AnimatedMarkOfExcellenceProps) => {
  const isReduced = useReducedMotion();
  const initial = isReduced ? false : 'hidden';

  return (
    <IconBase name={`mark-${marks}-animated`} {...props}>
      <motion.path animate='visible' d={MARK_SHAPES.barrel} initial={initial} transition={{ duration: 0.6, ease: ICON_EASE }} variants={DRAW} />
      <motion.path
        animate='visible'
        d={MARK_SHAPES.brake}
        initial={initial}
        transition={{ duration: 0.45, delay: 0.3, ease: ICON_EASE }}
        variants={DRAW}
      />
      {MARK_SHAPES.stripes(marks).map((d, index) => (
        <motion.path key={d} animate='visible' d={d} initial={initial} transition={{ duration: 0.25, delay: 0.5 + index * 0.08 }} variants={DRAW} />
      ))}
      {MARK_SHAPES.stars(marks).map((d, index) => (
        <motion.path
          key={d}
          animate={{ scale: [0, 1.35, 1], rotate: [-40, 8, 0], opacity: 1, fillOpacity: [0, 1, 0.3] }}
          d={d}
          fill={ACCENT}
          initial={isReduced ? false : { scale: 0, rotate: -40, opacity: 0, fillOpacity: 0 }}
          stroke={ACCENT}
          style={STAR_STYLE}
          transition={{ duration: 0.7, delay: STAR_DELAY + index * STAR_STEP, ease: ICON_EASE }}
        />
      ))}
    </IconBase>
  );
};
