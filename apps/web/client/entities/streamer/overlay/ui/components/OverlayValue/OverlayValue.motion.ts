import type { MotionProps } from 'motion/react';

import { OVERLAY_BOARD } from '../../../config';

export const OVERLAY_FLASH = {
  initial: { opacity: 0.55, scale: 1 },
  animate: { opacity: 0, scale: 1.25 },
  transition: { duration: OVERLAY_BOARD.flashSeconds }
} as const satisfies Pick<MotionProps, 'animate' | 'initial' | 'transition'>;
