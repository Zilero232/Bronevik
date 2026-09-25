import { describe, expect, it } from 'vitest';

import { averageCurve, battlesToAverage, runningAverage } from '../battles-to-target';

const BASE = { battles: 10_000, current: 49, expected: 55, target: 50 };

describe('battlesToAverage', () => {
  it('reaches the target at exactly the returned battle count', () => {
    const outcome = battlesToAverage(BASE);

    expect(outcome.kind).toBe('battles');

    if (outcome.kind === 'battles') {
      expect(runningAverage({ ...BASE, added: outcome.battles })).toBeGreaterThanOrEqual(BASE.target);
      expect(runningAverage({ ...BASE, added: outcome.battles - 1 })).toBeLessThan(BASE.target);
    }
  });

  it('is already done when the current value meets the target', () => {
    expect(battlesToAverage({ ...BASE, current: BASE.target })).toEqual({ kind: 'done' });
  });

  it('calls the target impossible when future battles are not better than it', () => {
    expect(battlesToAverage({ ...BASE, expected: BASE.target })).toEqual({ kind: 'impossible' });
  });

  it('needs more battles on a longer history', () => {
    const short = battlesToAverage({ ...BASE, battles: 1_000 });
    const long = battlesToAverage({ ...BASE, battles: 20_000 });

    expect(short.kind === 'battles' && long.kind === 'battles' && short.battles < long.battles).toBe(true);
  });

  it('needs a single battle on a fresh account', () => {
    expect(battlesToAverage({ ...BASE, battles: 0 })).toEqual({ kind: 'battles', battles: 1 });
  });
});

describe('averageCurve', () => {
  const curve = averageCurve({ ...BASE, horizon: 5_000, points: 20 });

  it('starts at the current value and ends at the horizon', () => {
    expect(curve[0]).toEqual({ battle: 0, value: BASE.current });
    expect(curve.at(-1)?.battle).toBe(5_000);
  });

  it('moves toward the expected value without passing it', () => {
    const values = curve.map(({ value }) => value);

    expect(values.every((value, index) => index === 0 || value >= values[index - 1])).toBe(true);
    expect(Math.max(...values)).toBeLessThan(BASE.expected);
  });
});
