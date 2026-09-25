import type { Transition, Variants } from 'motion/react';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const SPRING = { type: 'spring', stiffness: 380, damping: 32, mass: 0.8 } as const satisfies Transition;

export const REVEAL_VIEWPORT = { once: true, amount: 0.2 } as const;

export const FADE: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } }
};

export const SLIDE_UP: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
};

export const SLIDE_IN_LEFT: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT } }
};

export const SCALE_IN: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } }
};

export const HEAD_REVEAL: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_OUT } }
};

export const STAGGER: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
};

export const STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }
};

export const ROW_ITEM: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (index: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: EASE_OUT, delay: Math.min(index, 20) * 0.03 }
  })
};

export const PAGE_TRANSITION: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT, staggerChildren: 0.08 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_IN_OUT } }
};

export const DRAW_IN: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: EASE_OUT } }
};

export const POPUP: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: SPRING },
  exit: { opacity: 0, y: 4, scale: 0.98, transition: { duration: 0.12 } }
};
