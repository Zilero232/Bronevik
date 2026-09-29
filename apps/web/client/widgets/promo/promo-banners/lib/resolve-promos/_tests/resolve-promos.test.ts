import type { VehicleSummary } from '@otmetki/schemas';

import { Trophy } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import type { PromoSpec } from '../resolve-promos.types';

import { resolvePromos } from '../resolve-promos';

const tank: VehicleSummary = {
  tankId: 1,
  name: 'Объект 140',
  shortName: 'Об. 140',
  slug: 'object-140',
  nation: 'ussr',
  type: 'mediumTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null, large: null }
};

const specs = {
  mod: { href: '/mod', tone: 'accent', family: 'site', requires: 'modpack', art: { kind: 'mock', mock: 'manager' } },
  armor: { href: '/tanks', tankHref: (slug) => `/t/${slug}/armor`, tone: 'sky', family: 'site', art: { kind: 'tank', pick: 0 } },
  late: { href: '/marks', tone: 'gold', family: 'site', art: { kind: 'tank', pick: 5 } },
  cup: { href: '/tournaments', tone: 'battle', family: 'site', art: { kind: 'emblem', icon: Trophy } }
} satisfies Record<string, PromoSpec>;

describe('resolvePromos', () => {
  it('marks a modpack promo as coming soon until the modpack is published', () => {
    const [pending] = resolvePromos({ ids: ['mod'], specs, isModpackPublished: false, tanks: [] });
    const [published] = resolvePromos({ ids: ['mod'], specs, isModpackPublished: true, tanks: [] });

    expect(pending?.state).toBe('soon');
    expect(published?.state).toBe('live');
  });

  it('links a tank promo to the picked vehicle once the catalog has it', () => {
    const [withTank] = resolvePromos({ ids: ['armor'], specs, isModpackPublished: true, tanks: [tank] });
    const [withoutTank] = resolvePromos({ ids: ['armor'], specs, isModpackPublished: true, tanks: [] });

    expect(withTank).toMatchObject({ href: '/t/object-140/armor', art: { kind: 'tank', tank } });
    expect(withoutTank).toMatchObject({ href: '/tanks', art: { kind: 'tank', tank: null } });
  });

  it('leaves the art empty when the pick is past the loaded tanks', () => {
    const [promo] = resolvePromos({ ids: ['late'], specs, isModpackPublished: true, tanks: [tank] });

    expect(promo?.art).toEqual({ kind: 'tank', tank: null });
  });

  it('keeps the order of the ids and passes other art through', () => {
    const promos = resolvePromos({ ids: ['cup', 'mod'], specs, isModpackPublished: true, tanks: [] });

    expect(promos.map(({ id }) => id)).toEqual(['cup', 'mod']);
    expect(promos[0]?.art).toEqual({ kind: 'emblem', icon: Trophy });
  });
});
