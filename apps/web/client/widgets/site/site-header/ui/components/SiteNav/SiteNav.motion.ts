import type { Transition } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const NAV_INDICATOR = {
  layoutId: 'site-nav-indicator',
  transition: { type: 'tween', duration: 0.22, ease: EASE_OUT } satisfies Transition
} as const;
