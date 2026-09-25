import { describe, expect, it } from 'vitest';

import { clanAccent } from '../clan-accent';

const TAGS = ['KOPTE', 'RED', 'STEEL', 'VETER', 'MEOW', 'BOOM'];

const hueOf = (color: string) => Number(/hsl\((\d+)/.exec(color)?.[1]);

describe('clanAccent', () => {
  it('gives a clan the same colour on every render', () => {
    expect(clanAccent('KOPTE')).toBe(clanAccent('KOPTE'));
  });

  it('ignores the case of the tag', () => {
    expect(clanAccent('meow')).toBe(clanAccent('MEOW'));
  });

  it('keeps every hue inside the colour wheel', () => {
    TAGS.forEach((tag) => {
      expect(hueOf(clanAccent(tag))).toBeGreaterThanOrEqual(0);
      expect(hueOf(clanAccent(tag))).toBeLessThan(360);
    });
  });

  it('tells different clans apart', () => {
    expect(new Set(TAGS.map(clanAccent)).size).toBeGreaterThan(1);
  });
});
