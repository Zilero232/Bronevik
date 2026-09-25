import { describe, expect, it } from 'vitest';

import { createBurst } from '../burst';

describe('createBurst', () => {
  it('creates the requested number of particles with unique ids', () => {
    const particles = createBurst({ count: 16, radius: 40 });

    expect(particles).toHaveLength(16);
    expect(new Set(particles.map((particle) => particle.id)).size).toBe(16);
  });

  it('keeps every particle inside the radius', () => {
    const radius = 56;

    createBurst({ count: 24, radius }).forEach((particle) => {
      expect(Math.hypot(particle.x, particle.y)).toBeLessThanOrEqual(radius + 0.01);
    });
  });

  it('is deterministic, so server and client render the same burst', () => {
    expect(createBurst({ count: 12, radius: 30 })).toEqual(createBurst({ count: 12, radius: 30 }));
  });
});
