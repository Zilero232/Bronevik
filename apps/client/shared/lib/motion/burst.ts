import { round } from 'remeda';

import type { BurstInput, BurstParticle } from './motion.types';

import { EASE_OUT } from './motion';

const DISTANCE_STEPS = [1, 0.78, 0.6] as const;

const BURST_TRANSITION = { duration: 0.75, ease: EASE_OUT } as const;

export const createBurst = ({ count, radius, spread = 0.35 }: BurstInput): BurstParticle[] =>
  Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + (index % 2 === 0 ? spread : -spread) / count;
    const distance = radius * DISTANCE_STEPS[index % DISTANCE_STEPS.length];

    return {
      id: index,
      x: round(Math.cos(angle) * distance, 2),
      y: round(Math.sin(angle) * distance, 2),
      rotate: round((angle * 180) / Math.PI + 90, 2),
      scale: index % 3 === 0 ? 1 : 0.7,
      delay: round((index % 4) * 0.025, 3)
    };
  });

export const burstParticleMotion = ({ x, y, rotate, scale, delay }: BurstParticle) => ({
  initial: { x: 0, y: 0, opacity: 1, scale: 0, rotate },
  animate: { x, y, opacity: 0, scale, rotate },
  transition: { ...BURST_TRANSITION, delay }
});
