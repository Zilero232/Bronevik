import { ARMOR_FLAGS } from '@otmetki/gamedata';

import type { BuildPieceBuffersInput, PieceBuffers } from './build-buffers.types';

const UNKNOWN_PLATE = -1;

export const buildPieceBuffers = ({ piece, plates }: BuildPieceBuffersInput): PieceBuffers => {
  const { positions: source, indices, groups } = piece;
  const triangleCount = indices.length / 3;
  const plateOfTriangle = new Int32Array(triangleCount).fill(UNKNOWN_PLATE);
  const plateIndex = new Map(plates.map((plate, index) => [plate.name, index]));

  for (const { plate, start, count } of groups) {
    plateOfTriangle.fill(plateIndex.get(plate) ?? UNKNOWN_PLATE, start / 3, (start + count) / 3);
  }

  const positions = new Float32Array(triangleCount * 9);
  const normals = new Float32Array(triangleCount * 9);
  const thickness = new Float32Array(triangleCount * 3);
  const flags = new Float32Array(triangleCount * 3);
  const plate = new Float32Array(triangleCount * 3);

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const [a, b, c] = [indices[triangle * 3], indices[triangle * 3 + 1], indices[triangle * 3 + 2]].map((vertex) =>
      source.subarray(vertex * 3, vertex * 3 + 3)
    );

    const edge1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const edge2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const cross = [edge1[1] * edge2[2] - edge1[2] * edge2[1], edge1[2] * edge2[0] - edge1[0] * edge2[2], edge1[0] * edge2[1] - edge1[1] * edge2[0]];
    const length = Math.hypot(...cross) || 1;
    const index = plateOfTriangle[triangle];
    const armor = plates[index];

    for (const [corner, vertex] of [a, b, c].entries()) {
      const offset = (triangle * 3 + corner) * 3;

      positions.set(vertex, offset);
      normals.set([cross[0] / length, cross[1] / length, cross[2] / length], offset);
      thickness[triangle * 3 + corner] = armor?.thickness ?? 0;
      flags[triangle * 3 + corner] = armor?.flags ?? ARMOR_FLAGS.hollow;
      plate[triangle * 3 + corner] = index;
    }
  }

  return { positions, normals, thickness, flags, plate, triangleCount };
};
