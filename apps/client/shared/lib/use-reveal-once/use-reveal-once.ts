'use client';

import { useInView } from 'motion/react';
import { useRef } from 'react';

export const useRevealOnce = <E extends Element>() => {
  const ref = useRef<E>(null);
  const isRevealed = useInView(ref, { once: true, amount: 0.4 });

  return { ref, isRevealed };
};
