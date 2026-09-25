import type { Transition } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

import { TREE_MOTION } from '../../../config';

export const EDGE_DRAW = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 }
} as const;

export const LABEL_ENTER = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
} as const;

export const edgeTransition = (delay: number): Transition => ({ duration: TREE_MOTION.edgeDuration, ease: EASE_OUT, delay });
