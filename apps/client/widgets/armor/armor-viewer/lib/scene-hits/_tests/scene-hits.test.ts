import type { ArmorPieceGeometry } from '@bronevik/gamedata';
import type { Intersection } from 'three';

import { BufferAttribute, BufferGeometry, Group, Mesh, Vector3 } from 'three';
import { describe, expect, it } from 'vitest';

import type { ScenePart } from '../../scene-parts';

import { collectRayHits } from '../scene-hits';

const PIECE: ArmorPieceGeometry = {
  name: 'Hull',
  kind: 'hull',
  positions: new Float32Array([]),
  indices: new Uint32Array([]),
  groups: []
};

const PLATES = [
  { name: 'armor_1', thickness: 100, flags: 0 },
  { name: 'armor_2', thickness: 50, flags: 0 }
];

const PART: ScenePart = { layer: 'hull', piece: PIECE, plates: PLATES, position: [0, 0, 0] };

const meshOf = (name: string) => {
  const geometry = new BufferGeometry();

  geometry.setAttribute('aPlate', new BufferAttribute(new Float32Array([1, 1, 1]), 1));

  const mesh = new Mesh(geometry);

  mesh.name = name;

  return mesh;
};

const hitOn = (object: Intersection['object']): Intersection => ({
  object,
  distance: 3,
  point: new Vector3(),
  faceIndex: 0,
  face: { a: 0, b: 1, c: 2, normal: new Vector3(0, 0, 1), materialIndex: 0 }
});

describe('collectRayHits', () => {
  it('reads the plate and the facing cosine off a drawn piece', () => {
    const direction = new Vector3(0, 0, -1);
    const [hit] = collectRayHits({ intersections: [hitOn(meshOf(PIECE.name))], parts: [PART], direction });

    expect(hit.piece).toBe(PIECE.name);
    expect(hit.kind).toBe(PIECE.kind);
    expect(hit.plate).toBe(PLATES[1]);
    expect(hit.cosine).toBeCloseTo(new Vector3(0, 0, 1).dot(direction));
  });

  it('skips objects that are not drawn pieces or not meshes', () => {
    const direction = new Vector3(0, 0, -1);
    const group = new Group();

    group.name = PIECE.name;

    expect(collectRayHits({ intersections: [hitOn(meshOf('Turret')), hitOn(group)], parts: [PART], direction })).toEqual([]);
  });
});
