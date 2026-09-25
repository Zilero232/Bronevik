import type { Variants } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const EMBLEM_MOTION = {
  wreath: { hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.25 } } },
  leaf: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.35, ease: EASE_OUT } } },
  stem: { hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 0.9, ease: EASE_OUT } } },
  medal: {
    hidden: { opacity: 0, scale: 0.6, rotate: -25 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 160, damping: 16 } }
  }
} as const satisfies Record<string, Variants>;
