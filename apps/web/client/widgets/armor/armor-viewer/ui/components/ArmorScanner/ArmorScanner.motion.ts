import type { MotionProps } from 'motion/react';

export const SCANNER_SWEEP = {
  initial: { top: '0%', opacity: 0 },
  animate: { top: ['0%', '100%'], opacity: [0, 1, 1, 0] },
  transition: { duration: 2.4, ease: 'linear', repeat: Infinity }
} as const satisfies Pick<MotionProps, 'animate' | 'initial' | 'transition'>;
