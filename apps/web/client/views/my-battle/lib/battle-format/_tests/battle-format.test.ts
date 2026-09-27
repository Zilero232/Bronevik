import { describe, expect, it } from 'vitest';

import { RATING_TONES } from '@/shared/lib';

import { EFFICIENCY_TONES } from '../../../config';
import { durationClock, efficiencyTone } from '../battle-format';

const rank = (tone: string | null) => RATING_TONES.findIndex((item) => item === tone);

describe('efficiencyTone', () => {
  it('has no tone without a reference', () => {
    expect(efficiencyTone(null)).toBeNull();
  });

  it('never ranks a better ratio in a lower tone', () => {
    const ratios = [0, 0.5, 0.8, 1, 1.2, 1.5, 2, 3];
    const ranks = ratios.map((ratio) => rank(efficiencyTone(ratio)));

    ranks.slice(1).forEach((value, index) => expect(value).toBeGreaterThanOrEqual(ranks[index] ?? 0));
  });

  it('gives each configured step its own tone at the boundary', () => {
    EFFICIENCY_TONES.filter((step) => Number.isFinite(step.from)).forEach((step) => expect(efficiencyTone(step.from)).toBe(step.tone));
  });
});

describe('durationClock', () => {
  it('pads seconds to two digits', () => {
    expect(durationClock(65)).toBe('1:05');
  });

  it('shows a zero-length battle as 0:00', () => {
    expect(durationClock(0)).toBe('0:00');
  });
});
