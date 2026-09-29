import { describe, expect, it } from 'vitest';

import { sameSize, stickySize, wheelScale } from '../panel-size';

describe(stickySize, () => {
  it('keeps the widest size while the line count stays', () => {
    const previous = { lines: 1, width: 120, height: 20 };

    expect(stickySize({ previous, next: { lines: 1, width: 110, height: 20 } })).toEqual(previous);
    expect(stickySize({ previous, next: { lines: 1, width: 130, height: 18 } })).toEqual({ lines: 1, width: 130, height: 20 });
  });

  it('takes the new size when the text gets another line count', () => {
    expect(stickySize({ previous: { lines: 1, width: 300, height: 20 }, next: { lines: 2, width: 90, height: 40 } })).toEqual({
      lines: 2,
      width: 90,
      height: 40
    });

    expect(stickySize({ previous: undefined, next: { lines: 1, width: 5, height: 5 } })).toEqual({ lines: 1, width: 5, height: 5 });
  });

  it('compares sizes', () => {
    expect(sameSize(undefined, { lines: 1, width: 1, height: 1 })).toBe(false);
    expect(sameSize({ lines: 1, width: 1, height: 1 }, { lines: 1, width: 1, height: 1 })).toBe(true);
  });
});

describe(wheelScale, () => {
  it('grows on wheel up and shrinks on wheel down within the protocol limits', () => {
    expect(wheelScale({ current: 1, deltaY: -100 })).toBe(1.1);
    expect(wheelScale({ current: 1, deltaY: 100 })).toBe(0.9);
    expect(wheelScale({ current: 3, deltaY: -100 })).toBe(3);
    expect(wheelScale({ current: 0.5, deltaY: 100 })).toBe(0.5);
  });
});
