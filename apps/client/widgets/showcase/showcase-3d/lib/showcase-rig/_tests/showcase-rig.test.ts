import type { ArmorGeometry, ArmorPieceGeometry } from '@otmetki/gamedata';
import type { ArmorModulesData } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { showcaseRig } from '../showcase-rig';

const piece = (name: string, points: number[]): ArmorPieceGeometry => ({
  name,
  kind: 'hull',
  positions: new Float32Array(points),
  indices: new Uint32Array([0, 1, 2]),
  groups: []
});

const geometry: ArmorGeometry = {
  pieces: [
    piece('chassis', [-2, 0, -3, 2, 0, 3, 0, 0.5, 0]),
    piece('hull', [-1.5, 0, -2, 1.5, 1, 2, 0, 0, 0]),
    piece('turret', [-1, 0, -1, 1, 0.8, 1, 0, 0, 0]),
    piece('gun', [0, 0, 0, 0, 0.1, 3, 0, 0, 0])
  ],
  mounts: { hull: [0, 0.5, 0], turret: [0, 1, 0], guns: { turret: [0, 0.3, 0.8] }, pitch: {} }
};

const modules = {
  hull: { piece: 'hull', plates: [] },
  chassis: [{ piece: 'chassis', plates: [], name: 'c', displayName: 'c' }],
  turrets: [
    { piece: 'turret', plates: [], name: 't', displayName: 't', guns: [{ piece: 'gun', plates: [], name: 'g', displayName: 'g', shells: [] }] }
  ]
} satisfies ArmorModulesData;

describe('showcaseRig', () => {
  it('splits the body from the rotating turret group', () => {
    const rig = showcaseRig({ geometry, modules });

    expect(rig.body.map((part) => part.piece.name)).toEqual(['chassis', 'hull']);
    expect(rig.turret?.position).toEqual([0, 1.5, 0]);
    expect(rig.turret?.parts.map((part) => part.piece.name)).toEqual(['turret', 'gun']);
    expect(rig.turret?.parts[1].position).toEqual([0, 0.3, 0.8]);
  });

  it('measures the floor and the height across every part', () => {
    const rig = showcaseRig({ geometry, modules });

    expect(rig.floor).toBe(0);
    expect(rig.height).toBeCloseTo(2.3);
    expect(rig.radius).toBeGreaterThan(3);
  });

  it('skips a tank without a turret and pieces missing from the geometry', () => {
    const rig = showcaseRig({ geometry, modules: { ...modules, turrets: [], hull: { piece: 'missing', plates: [] } } });

    expect(rig.turret).toBeNull();
    expect(rig.body.map((part) => part.piece.name)).toEqual(['chassis']);
  });

  it('falls back to a unit bound when nothing matches', () => {
    const rig = showcaseRig({ geometry: { ...geometry, pieces: [] }, modules });

    expect(rig).toMatchObject({ radius: 1, floor: 0, height: 1, turret: null, body: [] });
  });
});
