import { describe, expect, it } from 'vitest';

import { gameLabel } from '../game-label';

describe('gameLabel', () => {
  it('keeps a real, localised name as it is', () => {
    expect(gameLabel('Досылатель орудия')).toBe('Досылатель орудия');
  });

  it('turns a raw localisation key into readable words', () => {
    expect(gameLabel('improvedSights tier1/name')).toBe('Improved sights tier1');
  });

  it('drops the crew role prefix of a skill key', () => {
    expect(gameLabel('commander_eagleEye')).toBe('Eagle eye');
  });
});
