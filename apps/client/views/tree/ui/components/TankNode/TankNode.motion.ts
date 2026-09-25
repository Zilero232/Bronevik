import type { Transition } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

import { TREE_MOTION } from '../../../config';

export const NODE_ENTER = {
  initial: { opacity: 0, x: -18, scale: 0.94 },
  animate: { opacity: 1, x: 0, scale: 1 }
} as const;

export const nodeTransition = (delay: number): Transition => ({ duration: TREE_MOTION.nodeDuration, ease: EASE_OUT, delay });
