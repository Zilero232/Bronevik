import type { VehicleCatalogItem } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { DESIGN_ICONS } from '../../../config';
import { renderSamples } from '../render-samples';

const vehicle = (tankId: number, isPremium: boolean, withImages = true): VehicleCatalogItem => ({
  tankId,
  name: `T${tankId}`,
  shortName: `T${tankId}`,
  slug: `t${tankId}`,
  nation: 'ussr',
  type: 'heavyTank',
  tier: 10,
  isPremium,
  isCollectible: false,
  status: 'researchable',
  images: withImages ? { small: 's.png', contour: 'c.png', big: 'b.png' } : { small: null, contour: null, big: null },
  role: null,
  isPreferential: false
});

describe('renderSamples', () => {
  it('returns nothing when no vehicle has every render', () => {
    expect(renderSamples([vehicle(1, false, false)])).toEqual([]);
  });

  it('yields one sample per configured slot', () => {
    expect(renderSamples([vehicle(1, false), vehicle(2, true)])).toHaveLength(DESIGN_ICONS.renderSamples.length);
  });

  it('strips images only from the fallback slots', () => {
    const samples = renderSamples([vehicle(1, false), vehicle(2, true)]);

    DESIGN_ICONS.renderSamples.forEach(({ withImages }, index) => {
      expect(samples[index]?.tank.images === null).toBe(!withImages);
    });
  });

  it('uses the regular vehicle for premium slots when no premium exists', () => {
    const samples = renderSamples([vehicle(1, false)]);

    expect(new Set(samples.map(({ tank }) => tank.name))).toEqual(new Set(['T1']));
  });
});
