import { describe, expect, it } from 'vitest';

import { armorAttackerSchema, armorModelSchema } from '../armor.schemas';

const VEHICLE = {
  tankId: 7169,
  name: 'IS-7',
  shortName: 'IS-7',
  slug: 'is-7',
  nation: 'ussr',
  type: 'heavyTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null }
} as const;

const MODEL = {
  vehicle: VEHICLE,
  gameVersion: '1.45.0.5231',
  hash: 'abc123',
  geometry: 'QlJBTQ==',
  modules: {
    hull: { piece: 'Hull', plates: [{ name: 'armor_1', thickness: 150, flags: 0 }] },
    chassis: [{ name: 'IS-7', displayName: 'IS-7', piece: 'Chassis', plates: [{ name: 'leftTrack', thickness: 20, flags: 2 }] }],
    turrets: [
      {
        name: 'IS-7',
        displayName: 'IS-7',
        piece: 'Turret_01',
        plates: [],
        guns: [
          {
            name: '_130mm_S-70',
            displayName: '130 mm S-70',
            piece: 'Gun_01',
            plates: [],
            shells: [
              {
                name: '_130mm_BR-482',
                displayName: 'BR-482',
                kind: 'ARMOR_PIERCING',
                caliber: 130,
                damage: 490,
                penetration: { at100m: 250, at500m: 245 },
                isPremium: false
              }
            ]
          }
        ]
      }
    ]
  },
  source: { repo: 'unicum-gg/wot.models', commit: 'f'.repeat(40), client: 'MT.RU.PRODUCTION' }
};

describe('armorModelSchema', () => {
  it('accepts a complete armor model response', () => {
    expect(armorModelSchema.parse(MODEL).modules.turrets[0].guns[0].shells).toHaveLength(1);
  });

  it('rejects geometry that is not base64', () => {
    expect(armorModelSchema.safeParse({ ...MODEL, geometry: 'not base64!' }).success).toBe(false);
  });

  it('rejects negative thickness and fractional flags', () => {
    const plates = [{ name: 'armor_1', thickness: -1, flags: 0.5 }];

    expect(armorModelSchema.safeParse({ ...MODEL, modules: { ...MODEL.modules, hull: { piece: 'Hull', plates } } }).success).toBe(false);
  });
});

describe('armorAttackerSchema', () => {
  it('strips the collision piece and plates from an attacking gun', () => {
    const [gun] = MODEL.modules.turrets[0].guns;
    const parsed = armorAttackerSchema.parse({ vehicle: VEHICLE, guns: [gun] });

    expect(parsed.guns[0]).toEqual({ name: gun.name, displayName: gun.displayName, shells: gun.shells });
  });

  it('rejects a shell with negative penetration', () => {
    const [gun] = MODEL.modules.turrets[0].guns;
    const shells = [{ ...gun.shells[0], penetration: { at100m: -1, at500m: 0 } }];

    expect(armorAttackerSchema.safeParse({ vehicle: VEHICLE, guns: [{ ...gun, shells }] }).success).toBe(false);
  });
});
