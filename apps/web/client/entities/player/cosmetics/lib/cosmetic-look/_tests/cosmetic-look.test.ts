import { COSMETIC_GRADES, COSMETIC_ITEMS, seasonalCosmeticCode } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { BADGE_ICONS } from '../../../config';
import { badgeIcon, cosmeticLabel, cosmeticTone } from '../cosmetic-look';

describe('cosmeticLabel', () => {
  it('labels every catalog item by its own code', () => {
    for (const item of COSMETIC_ITEMS) {
      expect(cosmeticLabel(item.code)).toEqual({ kind: 'static', code: item.code });
    }
  });

  it('labels a seasonal item by its season, slot and grade', () => {
    const code = seasonalCosmeticCode({ season: '2026-q3', slot: 'frame', grade: 'silver' });

    expect(cosmeticLabel(code)).toEqual({ kind: 'season', season: '2026-q3', slot: 'frame', grade: 'silver' });
  });

  it('gives no label to an unknown code', () => {
    expect(cosmeticLabel('banner-unknown')).toBeNull();
  });
});

describe('cosmeticTone', () => {
  it('gives every catalog item a tone', () => {
    for (const item of COSMETIC_ITEMS) {
      expect(cosmeticTone(item.code)).not.toBeNull();
    }
  });

  it('uses the grade as the tone of a seasonal item', () => {
    for (const grade of COSMETIC_GRADES) {
      expect(cosmeticTone(seasonalCosmeticCode({ season: '2026-q3', slot: 'badge', grade }))).toBe(grade);
    }
  });

  it('has no tone for an empty slot', () => {
    expect(cosmeticTone(null)).toBeNull();
  });
});

describe('badgeIcon', () => {
  it('falls back to the season icon for a seasonal badge', () => {
    expect(badgeIcon(seasonalCosmeticCode({ season: '2026-q3', slot: 'badge', grade: 'gold' }))).toBe(BADGE_ICONS.season);
  });
});
