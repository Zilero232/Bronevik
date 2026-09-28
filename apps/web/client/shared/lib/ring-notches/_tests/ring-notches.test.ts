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

  it('rounds coordinates so the server and the browser print the same markup', () => {
    const notches = ringNotches({ size: 88, thickness: 7, percents: [12.5, 33, 65, 85, 95] });

    for (const notch of notches) {
      for (const value of [notch.x1, notch.y1, notch.x2, notch.y2]) {
        expect(value).toBe(Math.round(value * 1000) / 1000);
      }
    }
  });

  it('lands exactly on the axis at a quarter turn', () => {
    const [right] = ringNotches({ size: 100, thickness: 6, percents: [25], overshoot: 0 });

    expect(right).toEqual({ percent: 25, x1: 94, y1: 50, x2: 100, y2: 50 });
  });
});
