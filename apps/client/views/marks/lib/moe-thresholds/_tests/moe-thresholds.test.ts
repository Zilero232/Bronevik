import type { MoeThreshold } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { thresholdVerdict, toMoeThresholds } from '../moe-thresholds';

const THRESHOLD: MoeThreshold = { tankId: 1, date: '2026-09-24', source: 'bronevik', p65: 2_000, p85: 2_600, p95: 3_000, p100: 3_600 };

describe('toMoeThresholds', () => {
  it('maps the 65, 85 and 95 percent columns onto one, two and three marks', () => {
    const { oneMark, twoMarks, threeMarks, hundredPercent } = toMoeThresholds(THRESHOLD);

    expect([oneMark, twoMarks, threeMarks, hundredPercent]).toEqual([THRESHOLD.p65, THRESHOLD.p85, THRESHOLD.p95, THRESHOLD.p100]);
  });

  it('leaves the hundred percent point out when it is unknown', () => {
    expect(toMoeThresholds({ ...THRESHOLD, p100: null }).hundredPercent).toBeUndefined();
  });
});

describe('thresholdVerdict', () => {
  it('calls a falling threshold good news for the player', () => {
    expect(thresholdVerdict(-40)).toBe('better');
  });

  it('calls a rising threshold bad news for the player', () => {
    expect(thresholdVerdict(40)).toBe('worse');
  });

  it('treats a missing or zero change as no change', () => {
    expect(thresholdVerdict(null)).toBe('same');
    expect(thresholdVerdict(0)).toBe('same');
  });
});
