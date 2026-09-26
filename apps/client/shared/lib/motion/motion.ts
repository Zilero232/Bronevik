import type { Transition, Variants } from 'motion/react';

export const EASE_OUT = [0.2, 0, 0, 1] as const;

export const SPRING = { type: 'tween', duration: 0.16, ease: EASE_OUT } as const satisfies Transition;

export const POPUP = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
} as const satisfies Variants;
