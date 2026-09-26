import { describe, expect, it } from 'vitest';

import { turretYaw } from '../turret-yaw';

describe('turretYaw', () => {
  const input = { amplitude: 0.5, period: 8 };

  it('starts centred and reaches both limits', () => {
    expect(turretYaw({ ...input, seconds: 0 })).toBeCloseTo(0);
    expect(turretYaw({ ...input, seconds: 2 })).toBeCloseTo(0.5);
    expect(turretYaw({ ...input, seconds: 4 })).toBeCloseTo(0);
    expect(turretYaw({ ...input, seconds: 6 })).toBeCloseTo(-0.5);
  });

  it('never leaves the traverse limits', () => {
    for (let seconds = -10; seconds < 30; seconds += 0.37) {
      expect(Math.abs(turretYaw({ ...input, seconds }))).toBeLessThanOrEqual(0.5 + 1e-9);
    }
  });

  it('holds still without a period or amplitude', () => {
    expect(turretYaw({ seconds: 3, amplitude: 0, period: 8 })).toBe(0);
    expect(turretYaw({ seconds: 3, amplitude: 0.5, period: 0 })).toBe(0);
  });
});
