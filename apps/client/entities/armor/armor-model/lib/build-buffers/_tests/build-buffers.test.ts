import type { ArmorPieceGeometry } from '@bronevik/gamedata';

import { ARMOR_FLAGS, decodeArmorGeometry, encodeArmorGeometry } from '@bronevik/gamedata';
import { describe, expect, it } from 'vitest';

import { buildPieceBuffers } from '../build-buffers';

const PIECE: ArmorPieceGeometry = {
  name: 'Hull',
  kind: 'hull',
  positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]),
  indices: new Uint32Array([0, 1, 2, 0, 3, 1, 0, 2, 3]),
  groups: [
    { plate: 'armor_1', start: 0, count: 3 },
    { plate: 'armor_14', start: 3, count: 3 }
  ]
};

const PLATES = [
  { name: 'armor_14', thickness: 30, flags: ARMOR_FLAGS.spaced },
  { name: 'armor_1', thickness: 150, flags: 0 }
];

const buffers = buildPieceBuffers({ piece: PIECE, plates: PLATES });

describe('buildPieceBuffers', () => {
  it('expands the indexed mesh into three vertices per triangle', () => {
    expect(buffers.triangleCount).toBe(PIECE.indices.length / 3);
    expect(buffers.positions).toHaveLength(PIECE.indices.length * 3);
    expect([...buffers.positions.subarray(3, 6)]).toEqual([...PIECE.positions.subarray(3, 6)]);
  });

  it('bakes a unit face normal from the winding into every corner', () => {
    expect([...buffers.normals.subarray(0, 9)]).toEqual([0, 0, 1, 0, 0, 1, 0, 0, 1]);

    for (let corner = 0; corner < buffers.normals.length; corner += 3) {
      expect(Math.hypot(...buffers.normals.subarray(corner, corner + 3))).toBeCloseTo(1);
    }
  });

  it('looks plates up by name, not by position in the table', () => {
    expect([...buffers.plate.subarray(0, 3)]).toEqual([1, 1, 1]);
    expect([...buffers.thickness.subarray(0, 3)]).toEqual([150, 150, 150]);
    expect([...buffers.flags.subarray(3, 6)]).toEqual([ARMOR_FLAGS.spaced, ARMOR_FLAGS.spaced, ARMOR_FLAGS.spaced]);
  });

  it('marks triangles no group covers as hollow with no plate', () => {
    expect([...buffers.plate.subarray(6, 9)]).toEqual([-1, -1, -1]);
    expect(buffers.flags[6]).toBe(ARMOR_FLAGS.hollow);
    expect(buffers.thickness[6]).toBe(0);
  });

  it('builds the same buffers from a decoded payload', () => {
    const [decoded] = decodeArmorGeometry(
      encodeArmorGeometry({ pieces: [PIECE], mounts: { hull: [0, 0, 0], turret: [0, 0, 0], guns: {}, pitch: {} } })
    ).pieces;

    const rebuilt = buildPieceBuffers({ piece: decoded, plates: PLATES });

    expect([...rebuilt.plate]).toEqual([...buffers.plate]);
    expect(rebuilt.positions[3]).toBeCloseTo(1, 3);
  });
});
