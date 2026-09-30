import { describe, expect, it } from 'vitest';

import { visibleRange } from '../visible-range';

const ROW = 68;

describe(visibleRange, () => {
  it('draws the rows in view plus the overscan on both sides', () => {
    expect(visibleRange({ scrollTop: ROW * 100, viewport: ROW * 5, rowHeight: ROW, count: 1000, overscan: 3 })).toEqual({
      start: 97,
      end: 109,
      total: 1000 * ROW
    });
  });

  it('never leaves the list at either end', () => {
    expect(visibleRange({ scrollTop: 0, viewport: ROW * 5, rowHeight: ROW, count: 1000, overscan: 3 }).start).toBe(0);
    expect(visibleRange({ scrollTop: ROW * 999, viewport: ROW * 5, rowHeight: ROW, count: 1000, overscan: 3 }).end).toBe(1000);
    expect(visibleRange({ scrollTop: -40, viewport: ROW, rowHeight: ROW, count: 2, overscan: 3 })).toEqual({ start: 0, end: 2, total: 2 * ROW });
  });

  it('draws nothing for an empty list', () => {
    expect(visibleRange({ scrollTop: 500, viewport: 300, rowHeight: ROW, count: 0, overscan: 3 })).toEqual({ start: 0, end: 0, total: 0 });
  });
});
