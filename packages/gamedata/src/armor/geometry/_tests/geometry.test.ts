import { describe, expect, it } from 'vitest';

import type { ArmorGeometry } from '../../model/armor-model.types';

import { base64ToBytes, bytesToBase64, decodeArmorGeometry, encodeArmorGeometry } from '../geometry';
import { ARMOR_GEOMETRY_FORMAT } from '../geometry.constants';

const GEOMETRY: ArmorGeometry = {
  mounts: { hull: [0, 0.9, 0], turret: [0, 0.7, 0.6], guns: { Turret_01: [0, 0.2, 0.8] }, pitch: { Gun_01: [-18, 6] } },
  pieces: [
    {
      name: 'Hull',
      kind: 'hull',
      positions: new Float32Array([-1.5, 0, -3, 1.5, 0, -3, 1.5, 1.2, 3, -1.5, 1.2, 3]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
      groups: [
        { plate: 'armor_1', start: 0, count: 3 },
        { plate: 'armor_2', start: 3, count: 3 }
      ]
    },
    {
      name: 'Gun_01',
      kind: 'gun',
      positions: new Float32Array([0, 0, 0, 0.1, 0, 5, 0, 0.1, 5]),
      indices: new Uint32Array([0, 1, 2]),
      groups: [{ plate: 'gun', start: 0, count: 3 }]
    },
    {
      name: 'Turret_01',
      kind: 'turret',
      positions: new Float32Array([0.5, 0.5, 0.5]),
      indices: new Uint32Array([]),
      groups: []
    }
  ]
};

const BIG_VERTEX_COUNT = ARMOR_GEOMETRY_FORMAT.maxShortIndex + 2;

describe('encodeArmorGeometry / decodeArmorGeometry', () => {
  it('round-trips positions within the quantisation step and indices exactly', () => {
    const decoded = decodeArmorGeometry(encodeArmorGeometry(GEOMETRY));

    expect(decoded.mounts).toEqual(GEOMETRY.mounts);

    for (const [index, piece] of GEOMETRY.pieces.entries()) {
      const result = decoded.pieces[index];

      expect(result.name).toBe(piece.name);
      expect(result.kind).toBe(piece.kind);
      expect(result.groups).toEqual(piece.groups);
      expect([...result.indices]).toEqual([...piece.indices]);

      for (const [position, value] of piece.positions.entries()) {
        expect(result.positions[position]).toBeCloseTo(value, 3);
      }
    }
  });

  it('keeps a degenerate piece with a single point where it was', () => {
    const turret = decodeArmorGeometry(encodeArmorGeometry(GEOMETRY)).pieces[2];

    expect([...turret.positions]).toEqual([0.5, 0.5, 0.5]);
  });

  it('switches to 32-bit indices for pieces beyond the 16-bit range', () => {
    const positions = new Float32Array(BIG_VERTEX_COUNT * 3).map((_, index) => index / 1000);
    const indices = new Uint32Array([0, BIG_VERTEX_COUNT - 1, BIG_VERTEX_COUNT - 2]);
    const decoded = decodeArmorGeometry(
      encodeArmorGeometry({ mounts: GEOMETRY.mounts, pieces: [{ name: 'Hull', kind: 'hull', positions, indices, groups: [] }] })
    );

    expect([...decoded.pieces[0].indices]).toEqual([...indices]);
  });

  it('packs a small tank far below the 20 KB budget', () => {
    expect(encodeArmorGeometry(GEOMETRY).byteLength).toBeLessThan(20_000);
  });

  it('rejects a payload without the magic prefix', () => {
    expect(() => decodeArmorGeometry(new Uint8Array(16))).toThrow();
  });

  it('rejects a truncated payload', () => {
    const bytes = encodeArmorGeometry(GEOMETRY);

    expect(() => decodeArmorGeometry(bytes.slice(0, bytes.length - 8))).toThrow(/truncated/);
  });

  it('rejects an unknown format version', () => {
    const bytes = encodeArmorGeometry(GEOMETRY);

    new DataView(bytes.buffer).setUint32(4, ARMOR_GEOMETRY_FORMAT.version + 1, true);

    expect(() => decodeArmorGeometry(bytes)).toThrow(/version/);
  });
});

describe('bytesToBase64 / base64ToBytes', () => {
  it('round-trips every byte value', () => {
    const bytes = Uint8Array.from({ length: 256 }, (_, index) => index);

    expect([...base64ToBytes(bytesToBase64(bytes))]).toEqual([...bytes]);
  });

  it('decodes an encoded geometry straight from base64', () => {
    const decoded = decodeArmorGeometry(base64ToBytes(bytesToBase64(encodeArmorGeometry(GEOMETRY))));

    expect(decoded.pieces.map(({ name }) => name)).toEqual(GEOMETRY.pieces.map(({ name }) => name));
  });
});
