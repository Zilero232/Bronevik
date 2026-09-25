import { EASE_OUT } from '@/shared/lib';

export const THEME_ICON_MOTION = {
  initial: { opacity: 0, rotate: -90, scale: 0.6 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  exit: { opacity: 0, rotate: 90, scale: 0.6 },
  transition: { duration: 0.25, ease: EASE_OUT }
} as const;
