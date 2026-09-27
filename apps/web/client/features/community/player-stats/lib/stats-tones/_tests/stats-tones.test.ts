import { describe, expect, it } from 'vitest';

import { statsTones, winRatePercent } from '../stats-tones';

describe('winRatePercent', () => {
  it('turns the server fraction into a percent', () => {
    expect(winRatePercent(0.52)).toBeCloseTo(52);
  });

  it('keeps a missing win rate missing', () => {
    expect(winRatePercent(null)).toBeNull();
  });
});

describe('statsTones', () => {
  it('rates a higher wn8 at least as well as a lower one', () => {
    const order = ['bad', 'below', 'average', 'good', 'great', 'unicum'];
    const low = statsTones({ wn8: 500, winRate: null }).wn8 ?? '';
    const high = statsTones({ wn8: 3000, winRate: null }).wn8 ?? '';

    expect(order.indexOf(high)).toBeGreaterThan(order.indexOf(low));
  });

  it('scores the win rate on the percent scale, not the fraction', () => {
    expect(statsTones({ wn8: null, winRate: 0.66 }).winRate).toBe(statsTones({ wn8: null, winRate: 0.7 }).winRate);
    expect(statsTones({ wn8: null, winRate: 0.66 }).winRate).not.toBe(statsTones({ wn8: null, winRate: 0.45 }).winRate);
  });

  it('leaves tones empty when the values are unknown', () => {
    expect(statsTones({ wn8: null, winRate: null })).toEqual({ wn8: null, winRate: null });
  });
});
