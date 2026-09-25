import { EASE_OUT } from '@/shared/lib';

export const CLUE_FLIP = {
  initial: { rotateX: -90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1 },
  exit: { rotateX: 90, opacity: 0 },
  transition: { duration: 0.35, ease: EASE_OUT }
} as const;
