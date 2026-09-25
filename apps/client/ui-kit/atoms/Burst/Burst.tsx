'use client';

import { clsx } from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { burstParticleMotion, createBurst } from '@/shared/lib';

import type { BurstProps } from './Burst.types';

import s from './Burst.module.scss';

export const Burst = ({ trigger, count = 14, radius = 56, className, children }: BurstProps) => {
  const isReduced = useReducedMotion();
  const particles = createBurst({ count, radius });

  return (
    <span className={clsx(s.root, className)}>
      {children}
      <AnimatePresence>
        {!isReduced && trigger > 0 && (
          <span aria-hidden key={trigger} className={s.layer}>
            <motion.span
              animate={{ scale: 2.4, opacity: 0 }}
              className={s.ring}
              initial={{ scale: 0.4, opacity: 0.9 }}
              transition={{ duration: 0.6 }}
            />
            {particles.map((particle) => (
              <motion.span key={particle.id} className={s.particle} {...burstParticleMotion(particle)} />
            ))}
          </span>
        )}
      </AnimatePresence>
    </span>
  );
};
