import type { Variants } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const RULER_FILL: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.6, ease: EASE_OUT, delay: 0.4 } }
};

export const RULER_PIN: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.7 + index * 0.35 } })
};
