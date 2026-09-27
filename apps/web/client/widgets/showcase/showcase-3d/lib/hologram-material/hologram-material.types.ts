import type { ShaderMaterial } from 'three';

export type HologramMaterials = {
  fill: ShaderMaterial;
  edge: ShaderMaterial;
  shadow: ShaderMaterial;
};

export type HologramMaterialsInput = {
  height: number;
};

export type HologramFrameInput = {
  materials: HologramMaterials;
  reveal: number;
  scan: number;
};
