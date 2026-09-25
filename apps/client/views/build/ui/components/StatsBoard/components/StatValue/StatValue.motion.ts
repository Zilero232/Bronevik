import type { Variants } from 'motion/react';

import { EASE_OUT } from '@/shared/lib';

export const FLASH: Variants = {
  hidden: { opacity: 0.6 },
  visible: { opacity: 0, transition: { duration: 0.9, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};
