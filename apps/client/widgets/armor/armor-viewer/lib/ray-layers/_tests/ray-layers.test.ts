import { ARMOR_FLAGS } from '@bronevik/gamedata';
import { describe, expect, it } from 'vitest';

import type { RayHit } from '../ray-layers.types';

import { toHitLayers } from '../ray-layers';

const SKIRT = { name: 'armor_14', thickness: 30, flags: ARMOR_FLAGS.spaced };
const SIDE = { name: 'armor_6', thickness: 100, flags: 0 };

const hit = (overrides: Partial<RayHit>): RayHit => ({ distance: 1, piece: 'Hull', kind: 'hull', plate: SIDE, cosine: -1, ...overrides });

describe('toHitLayers', () => {
  it('orders layers by distance along the ray', () => {
    const layers = toHitLayers({ hits: [hit({ distance: 2, plate: SIDE }), hit({ distance: 1, plate: SKIRT })], hideSpaced: false });

    expect(layers.map(({ plate }) => plate)).toEqual([SKIRT.name, SIDE.name]);
  });

  it('keeps only the faces the ray enters, whichever way the mesh is wound', () => {
    const inward = toHitLayers({
      hits: [hit({ distance: 1, plate: SKIRT, cosine: 0.5 }), hit({ distance: 1.1, plate: SKIRT, cosine: -0.5 }), hit({ distance: 2, cosine: 0.9 })],
      hideSpaced: false
    });

    expect(inward.map(({ distance }) => distance)).toEqual([1, 2]);
  });

  it('turns the cosine between ray and normal into an impact angle in degrees', () => {
    const [layer] = toHitLayers({ hits: [hit({ cosine: -Math.cos(Math.PI / 3) })], hideSpaced: false });

    expect(layer.angle).toBeCloseTo(60);
  });

  it('drops hidden spaced plates and faces without a plate', () => {
    const layers = toHitLayers({
      hits: [hit({ distance: 0.5, plate: undefined }), hit({ distance: 1, plate: SKIRT }), hit({ distance: 2 })],
      hideSpaced: true
    });

    expect(layers.map(({ plate }) => plate)).toEqual([SIDE.name]);
  });

  it('returns no layers for an empty ray', () => {
    expect(toHitLayers({ hits: [], hideSpaced: false })).toEqual([]);
  });
});
