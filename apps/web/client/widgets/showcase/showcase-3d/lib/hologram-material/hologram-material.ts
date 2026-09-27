import { Color, DoubleSide, ShaderMaterial } from 'three';

import type { HologramFrameInput, HologramMaterials, HologramMaterialsInput } from './hologram-material.types';

import { HOLOGRAM_COLORS, HOLOGRAM_SHADING } from '../../config';
import { HOLOGRAM_GLSL } from './hologram-material.glsl';

const heightUniforms = (height: number) => ({
  uFloor: { value: 0 },
  uHeight: { value: height },
  uReveal: { value: 1 },
  uScan: { value: -1 },
  uScanWidth: { value: HOLOGRAM_SHADING.scanWidth },
  uAccent: { value: new Color(HOLOGRAM_COLORS.accent) }
});

export const createHologramMaterials = ({ height }: HologramMaterialsInput): HologramMaterials => ({
  fill: new ShaderMaterial({
    vertexShader: HOLOGRAM_GLSL.fillVertex,
    fragmentShader: HOLOGRAM_GLSL.fillFragment,
    side: DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    uniforms: {
      ...heightUniforms(height),
      uFill: { value: new Color(HOLOGRAM_COLORS.fill) },
      uLight: { value: new Color(HOLOGRAM_COLORS.light) },
      uRim: { value: new Color(HOLOGRAM_COLORS.rim) },
      uRimStrength: { value: HOLOGRAM_SHADING.rimStrength },
      uScanStrength: { value: HOLOGRAM_SHADING.scanStrength },
      uScanline: { value: HOLOGRAM_SHADING.scanlineStrength }
    }
  }),
  edge: new ShaderMaterial({
    vertexShader: HOLOGRAM_GLSL.edgeVertex,
    fragmentShader: HOLOGRAM_GLSL.edgeFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      ...heightUniforms(height),
      uEdge: { value: new Color(HOLOGRAM_COLORS.edge) },
      uAlpha: { value: HOLOGRAM_SHADING.edgeAlpha }
    }
  }),
  shadow: new ShaderMaterial({
    vertexShader: HOLOGRAM_GLSL.shadowVertex,
    fragmentShader: HOLOGRAM_GLSL.shadowFragment,
    transparent: true,
    depthWrite: false,
    uniforms: { uAlpha: { value: HOLOGRAM_SHADING.shadowAlpha } }
  })
});

export const applyHologramFrame = ({ materials, reveal, scan }: HologramFrameInput) => {
  for (const material of [materials.fill, materials.edge]) {
    material.uniforms.uReveal.value = reveal;
    material.uniforms.uScan.value = scan;
  }
};

export const disposeHologramMaterials = (materials: HologramMaterials) => {
  for (const material of Object.values(materials)) {
    material.dispose();
  }
};
