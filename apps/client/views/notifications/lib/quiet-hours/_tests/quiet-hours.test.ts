import { describe, expect, it } from 'vitest';

import { crossesMidnight, dialPoint, formatHour, isQuietHour, QUIET_DIAL, quietArcPath, quietHourList, quietSpan } from '..';

const NIGHT = { start: 23, end: 7 } as const;
const DAY = { start: 9, end: 18 } as const;
const HOURS = Array.from({ length: QUIET_DIAL.hours }, (_, hour) => hour);

describe('quietSpan', () => {
  it('counts the silent hours across midnight', () => {
    expect(quietSpan(NIGHT)).toBe(QUIET_DIAL.hours - NIGHT.start + NIGHT.end);
  });

  it('counts the silent hours inside one day', () => {
    expect(quietSpan(DAY)).toBe(DAY.end - DAY.start);
  });

  it('adds up with the opposite range to a full day', () => {
    expect(quietSpan(NIGHT) + quietSpan({ start: NIGHT.end, end: NIGHT.start })).toBe(QUIET_DIAL.hours);
  });
});

describe('isQuietHour', () => {
  it('silences the start hour and releases the end hour', () => {
    expect(isQuietHour({ hour: NIGHT.start, range: NIGHT })).toBe(true);
    expect(isQuietHour({ hour: NIGHT.end, range: NIGHT })).toBe(false);
  });

  it('silences exactly as many hours as the span', () => {
    [NIGHT, DAY].forEach((range) => {
      expect(HOURS.filter((hour) => isQuietHour({ hour, range }))).toHaveLength(quietSpan(range));
    });
  });

  it('treats midnight as silent for a range that wraps it', () => {
    expect(isQuietHour({ hour: 0, range: NIGHT })).toBe(true);
    expect(isQuietHour({ hour: 0, range: DAY })).toBe(false);
  });
});

describe('quietHourList', () => {
  it('lists the silent hours in order from the start', () => {
    const list = quietHourList(NIGHT);

    expect(list[0]).toBe(NIGHT.start);
    expect(list).toHaveLength(quietSpan(NIGHT));
    expect(list.every((hour) => isQuietHour({ hour, range: NIGHT }))).toBe(true);
  });
});

describe('crossesMidnight', () => {
  it('tells a wrapping range from a daytime one', () => {
    expect(crossesMidnight(NIGHT)).toBe(true);
    expect(crossesMidnight(DAY)).toBe(false);
  });

  it('does not count a range that ends exactly at midnight', () => {
    expect(crossesMidnight({ start: 22, end: 0 })).toBe(false);
  });
});

describe('dialPoint', () => {
  it('puts midnight at the top and noon at the bottom of the dial', () => {
    expect(dialPoint({ hour: 0, center: 50, radius: 40 })).toEqual({ x: 50, y: 10 });
    expect(dialPoint({ hour: QUIET_DIAL.hours / 2, center: 50, radius: 40 })).toEqual({ x: 50, y: 90 });
  });

  it('turns clockwise', () => {
    expect(dialPoint({ hour: QUIET_DIAL.hours / 4, center: 50, radius: 40 }).x).toBeGreaterThan(50);
  });
});

describe('quietArcPath', () => {
  it('takes the long way round only when more than half the day is silent', () => {
    const flag = (range: { start: number; end: number }) => quietArcPath({ range, center: 50, radius: 40 }).split(' ')[7];

    expect(flag({ start: 20, end: 10 })).toBe('1');
    expect(flag(NIGHT)).toBe('0');
  });
});

describe('formatHour', () => {
  it('pads single-digit hours so the clock reads evenly', () => {
    expect(formatHour(7)).toBe('07:00');
    expect(formatHour(23)).toBe('23:00');
  });
});
