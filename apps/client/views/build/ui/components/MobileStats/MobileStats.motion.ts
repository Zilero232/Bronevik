import type { Variants } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const SHEET: Variants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.25, ease: EASE_OUT } },
  open: { height: 'auto', opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } }
};
