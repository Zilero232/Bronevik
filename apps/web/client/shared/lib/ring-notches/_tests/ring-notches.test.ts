import { describe, expect, it } from 'vitest';

import { ringNotches } from '../ring-notches';

describe('ringNotches', () => {
  it('places a notch on the ring for each percent, clockwise from the top', () => {
    const [top, right] = ringNotches({ size: 100, thickness: 6, percents: [0, 25], overshoot: 0 });

    expect(top.x2).toBeCloseTo(50);
    expect(top.y2).toBeCloseTo(0);
    expect(top.y1).toBeCloseTo(6);
    expect(right.x2).toBeCloseTo(100);
    expect(right.y2).toBeCloseTo(50);
  });

  it('keeps the inner end inside the ring', () => {
    const [notch] = ringNotches({ size: 10, thickness: 8, percents: [50] });

    expect(notch.y1).toBeCloseTo(5);
  });
});
