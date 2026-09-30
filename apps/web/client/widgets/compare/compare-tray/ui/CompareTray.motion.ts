import { MOTION, MOTION_TRANSITION } from '@/shared/lib';

export const COMPARE_TRAY_MOTION = {
  initial: { opacity: 0, y: MOTION.shift * 3 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: MOTION.shift * 3 },
  transition: MOTION_TRANSITION.enter
} as const;
