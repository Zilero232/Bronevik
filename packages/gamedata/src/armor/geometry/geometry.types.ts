import type { ArmorGroup, ArmorMounts, ArmorPieceKind, Vec3 } from '../model/armor-model.types';

export type PackedPieceHeader = {
  name: string;
  kind: ArmorPieceKind;
  vertexCount: number;
  indexCount: number;
  min: Vec3;
  max: Vec3;
  groups: ArmorGroup[];
};

export type PackedHeader = {
  mounts: ArmorMounts;
  pieces: PackedPieceHeader[];
};

export type QuantizeInput = {
  positions: Float32Array;
  min: Vec3;
  max: Vec3;
};

export type DequantizeInput = {
  quantized: Int16Array;
  min: Vec3;
  max: Vec3;
};
