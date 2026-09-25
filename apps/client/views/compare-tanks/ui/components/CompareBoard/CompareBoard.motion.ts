import type { Variants } from 'motion/react';

import { EASE_OUT, SPRING } from '@/shared/lib';

export const COLUMN: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: EASE_OUT, delay: Math.min(index, 6) * 0.06 }
  }),
  exit: { opacity: 0, scale: 0.94, filter: 'blur(4px)', transition: { duration: 0.22 } }
};

export const COLUMN_LAYOUT = { layout: SPRING } as const;
