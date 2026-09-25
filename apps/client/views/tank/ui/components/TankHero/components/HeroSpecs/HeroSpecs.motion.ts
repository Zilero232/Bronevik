import type { Variants } from 'motion/react';

export const SPECS_LIST: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } }
};
