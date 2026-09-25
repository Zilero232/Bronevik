import { EASE_OUT } from '@/shared/lib';

export const WATERMARK_MOTION = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 1.2, ease: EASE_OUT }
} as const;

export const SILHOUETTE_MOTION = {
  initial: { opacity: 0, x: -40, scale: 0.96 },
  animate: { opacity: 1, x: 0, scale: 1 },
  transition: { duration: 1.4, ease: EASE_OUT, delay: 0.15 }
} as const;
