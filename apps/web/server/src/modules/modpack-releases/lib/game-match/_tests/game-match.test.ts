import { describe, expect, it } from 'vitest';

import { matchesGame } from '../game-match';

describe('matchesGame', () => {
  it('matches every build of a minor version through a wildcard', () => {
    expect(matchesGame({ pattern: '1.46.*', game: '1.46.0.8259' })).toBe(true);
    expect(matchesGame({ pattern: '1.46.*', game: '1.47.0.0' })).toBe(false);
  });

  it('treats missing trailing parts as zero', () => {
    expect(matchesGame({ pattern: '1.46', game: '1.46.0.0' })).toBe(true);
    expect(matchesGame({ pattern: '1.46', game: '1.46.1.0' })).toBe(false);
  });

  it('compares parts numerically, not as text', () => {
    expect(matchesGame({ pattern: '1.5.*', game: '1.50.0.0' })).toBe(false);
    expect(matchesGame({ pattern: '1.050.0.0', game: '1.50.0.0' })).toBe(true);
  });
});
