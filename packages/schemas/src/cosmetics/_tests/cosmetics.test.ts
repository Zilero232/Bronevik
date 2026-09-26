import { describe, expect, it } from 'vitest';

import { SEASON_TRACK } from '../../progression/progression.constants';
import { OVERLAY_THEMES } from '../../streamers/streamers.constants';
import { catalogCosmetics, cosmeticOf, isPurchasableCosmetic, overlayThemeCosmetic, seasonalCosmeticCode } from '../cosmetics';
import { COSMETIC_CODE, COSMETIC_ITEMS } from '../cosmetics.constants';

describe('cosmetic catalog', () => {
  it('has unique codes that fit the code pattern', () => {
    const codes = COSMETIC_ITEMS.map((item) => item.code);

    expect(new Set(codes).size).toBe(codes.length);

    for (const code of codes) {
      expect(COSMETIC_CODE.pattern.test(code)).toBe(true);
    }
  });

  it('prices only shop items', () => {
    for (const item of catalogCosmetics()) {
      expect(item.price !== null).toBe(item.source === 'shop');
      expect(isPurchasableCosmetic(item)).toBe(item.source === 'shop');
    }
  });

  it('has a cosmetic for every premium overlay theme and none for a standard one', () => {
    for (const theme of OVERLAY_THEMES.premium) {
      const code = overlayThemeCosmetic(theme);

      expect(code).not.toBeNull();
      expect(cosmeticOf(code ?? '')?.slot).toBe('overlayTheme');
    }

    for (const theme of OVERLAY_THEMES.standard) {
      expect(overlayThemeCosmetic(theme)).toBeNull();
    }
  });
});

describe('seasonal cosmetics', () => {
  it('resolves every season track reward to a seasonal item', () => {
    for (const reward of SEASON_TRACK.rewards) {
      if (reward.kind !== 'cosmetic') {
        continue;
      }

      const code = seasonalCosmeticCode({ season: '2026-q3', slot: reward.slot, grade: reward.grade });
      const item = cosmeticOf(code);

      expect(COSMETIC_CODE.pattern.test(code)).toBe(true);
      expect(item).toMatchObject({ slot: reward.slot, grade: reward.grade, season: '2026-q3', source: 'season', price: null });
    }
  });

  it('returns null for an unknown code', () => {
    expect(cosmeticOf('season-2026-q9-badge-gold')).toBeNull();
    expect(cosmeticOf('frame-diamond')).toBeNull();
  });
});
