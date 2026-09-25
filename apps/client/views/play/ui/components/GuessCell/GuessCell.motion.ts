import type { Transition } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

import { GUESS_MOTION } from '../../../config';

export const CELL_FLIP = {
  initial: { rotateX: -90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1 }
} as const;

export const cellTransition = (index: number): Transition => ({
  duration: GUESS_MOTION.cellFlip,
  ease: EASE_OUT,
  delay: index * GUESS_MOTION.cellStagger
});
