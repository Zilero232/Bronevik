import type { Transition } from 'motion/react';

import { EASE_OUT, SPRING } from '@/shared/lib';

import { GUESS_CLUES } from '../../../config';

const MAX_BLUR = 14;

export const silhouetteBlur = (clueCount: number) => Math.round(MAX_BLUR * (1 - clueCount / (GUESS_CLUES.length + 1)));

export const SILHOUETTE_TRANSITION: Transition = { duration: 0.8, ease: EASE_OUT };

export const NAME_REVEAL = {
  initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: SPRING
} as const;

export const RENDER_REVEAL = {
  initial: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  transition: SPRING
} as const;

export const MARK_POP = {
  initial: { opacity: 0, scale: 0.4, rotate: -20 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  transition: { ...SPRING, delay: 0.25 }
} as const;
