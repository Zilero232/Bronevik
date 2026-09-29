import { describe, expect, it } from 'vitest';

import { thresholdVerdict } from '../moe-threshold';

describe('thresholdVerdict', () => {
  it('calls a falling threshold good news for the player', () => {
    expect(thresholdVerdict(-40)).toBe('better');
  });

  it('calls a rising threshold bad news, since the mark gets harder', () => {
    expect(thresholdVerdict(40)).toBe('worse');
  });

  it('treats a missing or zero change as no change', () => {
    expect(thresholdVerdict(null)).toBe('same');
    expect(thresholdVerdict(0)).toBe('same');
  });
});
