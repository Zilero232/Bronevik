import type { Variants } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const FLOW_TRACER = {
  variants: {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 1.4, ease: EASE_OUT } }
  } satisfies Variants,
  viewport: { once: true, amount: 0.2 }
} as const;
