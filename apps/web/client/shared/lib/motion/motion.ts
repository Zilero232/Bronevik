import type { Transition, Variants } from 'motion/react';

export const EASE_OUT = [0.2, 0, 0, 1] as const;

export const MOTION = {
  duration: { fast: 0.1, base: 0.16, lift: 0.18, enter: 0.24 },
  shift: 8,
  stagger: 0.03
} as const;

export const MOTION_TRANSITION = {
  base: { type: 'tween', duration: MOTION.duration.base, ease: EASE_OUT },
  enter: { type: 'tween', duration: MOTION.duration.enter, ease: EASE_OUT },
  layout: { type: 'tween', duration: MOTION.duration.enter, ease: EASE_OUT }
} as const satisfies Record<string, Transition>;

export const MOTION_VARIANTS = {
  listItem: {
    hidden: { opacity: 0, y: MOTION.shift },
    shown: { opacity: 1, y: 0, transition: MOTION_TRANSITION.enter },
    exit: { opacity: 0, scale: 0.98, transition: MOTION_TRANSITION.base }
  },
  panel: {
    hidden: { opacity: 0, y: MOTION.shift / 2 },
    shown: { opacity: 1, y: 0, transition: MOTION_TRANSITION.enter },
    exit: { opacity: 0, transition: { ...MOTION_TRANSITION.base, duration: MOTION.duration.fast } }
  }
} as const satisfies Record<string, Variants>;
