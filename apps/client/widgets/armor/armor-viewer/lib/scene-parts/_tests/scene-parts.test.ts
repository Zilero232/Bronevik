import type { ArmorGeometry, ArmorPieceGeometry } from '@bronevik/gamedata';
import type { ArmorModulesData } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { modelBounds, sceneParts } from '../scene-parts';

const piece = (name: string, kind: ArmorPieceGeometry['kind']): ArmorPieceGeometry => ({
  name,
  kind,
  positions: new Float32Array([-1, 0, -2, 1, 1, 2]),
  indices: new Uint32Array([]),
  groups: []
});

const GEOMETRY: ArmorGeometry = {
  pieces: [piece('Chassis', 'chassis'), piece('Hull', 'hull'), piece('Turret_01', 'turret'), piece('Gun_01', 'gun')],
  mounts: { hull: [0, 1, 0], turret: [0, 0.5, 0.5], guns: { Turret_01: [0, 0.2, 1] }, pitch: {} }
};

const GUN = { name: 'gun', displayName: 'gun', piece: 'Gun_01', plates: [], shells: [] };
const TURRET = { name: 'turret', displayName: 'turret', piece: 'Turret_01', plates: [], guns: [GUN] };

const MODULES: ArmorModulesData = {
  hull: { piece: 'Hull', plates: [] },
  chassis: [{ name: 'stock', displayName: 'stock', piece: 'Chassis', plates: [] }],
  turrets: [TURRET]
};

const ALL = ['hull', 'turret', 'gun', 'chassis', 'spaced'] as const;

describe('sceneParts', () => {
  it('stacks the mounts: hull on the chassis, turret on the hull, gun on the turret', () => {
    const parts = sceneParts({ geometry: GEOMETRY, modules: MODULES, turret: TURRET, gun: GUN, layers: ALL });
    const at = (layer: string) => parts.find((part) => part.layer === layer)?.position;

    expect(at('chassis')).toEqual([0, 0, 0]);
    expect(at('hull')).toEqual([0, 1, 0]);
    expect(at('turret')).toEqual([0, 1.5, 0.5]);
    expect(at('gun')).toEqual([0, 1.7, 1.5]);
  });

  it('leaves out switched-off layers and pieces the model does not have', () => {
    const parts = sceneParts({ geometry: GEOMETRY, modules: MODULES, turret: TURRET, gun: { ...GUN, piece: 'Gun_09' }, layers: ['hull', 'gun'] });

    expect(parts.map(({ layer }) => layer)).toEqual(['hull']);
  });

  it('draws a turretless vehicle without a turret or gun', () => {
    const parts = sceneParts({ geometry: GEOMETRY, modules: { ...MODULES, turrets: [] }, turret: undefined, gun: undefined, layers: ALL });

    expect(parts.map(({ layer }) => layer)).toEqual(['chassis', 'hull']);
  });
});

describe('modelBounds', () => {
  it('centres on the mounted pieces and covers them with its radius', () => {
    const parts = sceneParts({ geometry: GEOMETRY, modules: MODULES, turret: TURRET, gun: GUN, layers: ['chassis', 'hull'] });
    const { center, radius } = modelBounds(parts);

    expect(center).toEqual([0, 1, 0]);
    expect(radius).toBeCloseTo(Math.hypot(2, 2, 4) / 2);
  });

  it('falls back to a unit sphere when nothing is drawn', () => {
    expect(modelBounds([])).toEqual({ center: [0, 0, 0], radius: 1 });
  });
});
