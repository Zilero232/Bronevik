import type { Transition, Variants } from 'motion/react';

export const EASE_OUT = [0.2, 0, 0, 1] as const;

export const SPRING = { type: 'tween', duration: 0.16, ease: EASE_OUT } as const satisfies Transition;

export const REVEAL_VIEWPORT = { once: true, amount: 0.2 } as const;

const STATIC: Variants = { hidden: {}, visible: {} };

export const FADE = STATIC;

export const SLIDE_UP = STATIC;

export const SCALE_IN = STATIC;

export const HEAD_REVEAL = STATIC;

export const STAGGER = STATIC;

export const STAGGER_ITEM = STATIC;

export const ROW_ITEM = STATIC;

export const DRAW_IN = STATIC;

export const POPUP: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};
