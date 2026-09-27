import type { MotionProps } from 'motion/react';

export const INBOX_ENTRY_EXIT = {
  exit: { opacity: 0, height: 0 }
} as const satisfies Pick<MotionProps, 'exit'>;
