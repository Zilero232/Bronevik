import type { TargetAndTransition, Transition } from 'motion/react';

export const LAMP_PULSE: { animate: TargetAndTransition; transition: Transition } = {
  animate: { opacity: [1, 0.3, 1], scale: [1, 0.82, 1] },
  transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
};
