import type { Variants } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const REVEAL = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }
} as const satisfies Variants;
