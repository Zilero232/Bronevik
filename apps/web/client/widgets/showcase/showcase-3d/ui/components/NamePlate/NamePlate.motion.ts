import type { Variants } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const PLATE_MOTION = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.24, ease: EASE_OUT } },
  exit: { opacity: 0, x: 8, transition: { duration: 0.16, ease: EASE_OUT } }
} as const satisfies Variants;
