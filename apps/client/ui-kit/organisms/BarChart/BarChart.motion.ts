import type { Variants } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const BAR_MOTION: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: (index: number = 0) => ({
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_OUT, delay: Math.min(index, 24) * 0.035 }
  })
};
