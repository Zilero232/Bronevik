import { describe, expect, it } from 'vitest';

import { REPLAY_FORMAT } from '../../../config';
import { formatCount, formatDuration, formatSize, romanTier } from '../format-replay';

describe(formatCount, () => {
  it('groups thousands and shows a dash for an unknown value', () => {
    expect(formatCount(1234567)).toBe(['1', '234', '567'].join(REPLAY_FORMAT.thinSpace));
    expect(formatCount(0)).toBe('0');
    expect(formatCount(null)).toBe(REPLAY_FORMAT.dash);
  });
});

describe(formatDuration, () => {
  it('writes minutes and seconds', () => {
    expect(formatDuration(402)).toBe('6:42');
    expect(formatDuration(59)).toBe('0:59');
    expect(formatDuration(null)).toBe(REPLAY_FORMAT.dash);
  });
});

describe(formatSize, () => {
  it('writes megabytes with one decimal', () => {
    expect(formatSize(REPLAY_FORMAT.bytesPerMegabyte * 2.25)).toBe('2.3');
  });
});

describe(romanTier, () => {
  it('writes every tier the game has and nothing past it', () => {
    expect(REPLAY_FORMAT.romanTiers.map((_, index) => romanTier(index + 1))).toEqual([...REPLAY_FORMAT.romanTiers]);
    expect(romanTier(12)).toBeNull();
    expect(romanTier(null)).toBeNull();
  });
});
