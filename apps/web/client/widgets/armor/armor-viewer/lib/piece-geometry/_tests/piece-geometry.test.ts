import { describe, expect, it } from 'vitest';

import type { PieceBuffers } from '@/entities/armor/armor-model';

import { toBufferGeometry } from '../piece-geometry';

const BUFFERS: PieceBuffers = {
  positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]),
  normals: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]),
  thickness: new Float32Array([120, 120, 120]),
  flags: new Float32Array([0, 0, 0]),
  plate: new Float32Array([2, 2, 2]),
  triangleCount: 1
};

describe('toBufferGeometry', () => {
  it('exposes one vertex per position triple across every attribute', () => {
    const geometry = toBufferGeometry(BUFFERS);
    const vertices = BUFFERS.positions.length / 3;

    for (const name of ['position', 'normal', 'aThickness', 'aFlags', 'aPlate']) {
      expect(geometry.getAttribute(name).count).toBe(vertices);
    }
  });

  it('keeps the per-face plate index readable by vertex', () => {
    const geometry = toBufferGeometry(BUFFERS);

    expect(geometry.getAttribute('aPlate').getX(0)).toBe(BUFFERS.plate[0]);
    expect(geometry.boundingSphere).not.toBeNull();
  });
});
