import type { ArmorPieceGeometry, ArmorPlate } from '@bronevik/gamedata';

export type BuildPieceBuffersInput = {
  piece: ArmorPieceGeometry;
  plates: readonly ArmorPlate[];
};

export type PieceBuffers = {
  positions: Float32Array;
  normals: Float32Array;
  thickness: Float32Array;
  flags: Float32Array;
  plate: Float32Array;
  triangleCount: number;
};
