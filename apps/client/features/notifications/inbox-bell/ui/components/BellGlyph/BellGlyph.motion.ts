import { EASE_OUT, SPRING } from '@/shared/lib';

export const BELL_SWING = {
  keyframes: { rotate: [0, -16, 13, -9, 5, 0] },
  transition: { duration: 0.7, ease: EASE_OUT }
};

export const BADGE_MOTION = {
  initial: { opacity: 0, scale: 0.4 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.4 },
  transition: SPRING
} as const;

export const COUNT_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.2, ease: EASE_OUT }
} as const;
