import { MASTERY_PERCENTILES } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { expectedValuesDate, masteryThresholdRows, parsePoliroidMoe } from '../community-data';

describe('parsePoliroidMoe', () => {
  it('reads the poliroid shape with string numbers', () => {
    const rows = parsePoliroidMoe({ status: 'ok', data: [{ id: '1', marks: { 65: '1000', 85: '1500', 95: '2000' } }] });

    expect(rows).toEqual([{ tankId: 1, p65: 1000, p85: 1500, p95: 2000 }]);
  });

  it('drops a row whose thresholds are not increasing', () => {
    expect(parsePoliroidMoe({ data: [{ id: 1, marks: { 65: 2000, 85: 1500, 95: 2500 } }] })).toEqual([]);
  });

  it('rejects a payload without data', () => {
    expect(() => parsePoliroidMoe({ status: 'error' })).toThrow();
  });
});

describe('masteryThresholdRows', () => {
  it('maps the four mastery percentiles onto class columns', () => {
    const distribution = {
      [MASTERY_PERCENTILES.third]: 100,
      [MASTERY_PERCENTILES.second]: 200,
      [MASTERY_PERCENTILES.first]: 300,
      [MASTERY_PERCENTILES.ace]: 400
    };

    expect(masteryThresholdRows({ 42: distribution })).toEqual([{ tankId: 42, class3: 100, class2: 200, class1: 300, master: 400 }]);
  });

  it('skips a tank with an incomplete distribution', () => {
    expect(masteryThresholdRows({ 42: { [MASTERY_PERCENTILES.third]: 100 } })).toEqual([]);
  });
});

describe('expectedValuesDate', () => {
  const now = new Date('2026-09-24T15:00:00Z');

  it('uses the date in the XVM header version', () => {
    expect(expectedValuesDate({ header: { version: '2026-09-23' }, now }).toISOString()).toBe('2026-09-23T00:00:00.000Z');
  });

  it('falls back to today without a dated header', () => {
    expect(expectedValuesDate({ header: {}, now }).getTime()).toBeLessThanOrEqual(now.getTime());
  });
});
