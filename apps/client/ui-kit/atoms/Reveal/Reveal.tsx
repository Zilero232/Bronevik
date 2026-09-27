'use client';

import { motion } from 'motion/react';

import { useRevealOnce } from '@/shared/lib';

import type { RevealProps } from './Reveal.types';

import { REVEAL } from './Reveal.motion';

export const Reveal = ({ children, className }: RevealProps) => {
  const { ref, isRevealed } = useRevealOnce<HTMLDivElement>();

  return (
    <motion.div ref={ref} animate={isRevealed ? 'shown' : 'hidden'} className={className} initial='hidden' variants={REVEAL}>
      {children}
    </motion.div>
  );
};
