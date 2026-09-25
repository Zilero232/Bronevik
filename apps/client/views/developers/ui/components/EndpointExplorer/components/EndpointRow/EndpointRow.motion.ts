import { EASE_OUT } from '@/shared/lib';

export const DETAILS_MOTION = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: { duration: 0.32, ease: EASE_OUT } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.2 } }
} as const;
