import { Color, DoubleSide, ShaderMaterial } from 'three';

import type { ArmorShaderValues } from '@/entities/armor/armor-model';

import { ARMOR_FRAGMENT_SHADER, ARMOR_PALETTE, ARMOR_VERTEX_SHADER } from '@/entities/armor/armor-model';

import type { ApplyShaderValuesInput } from './ArmorScene.types';

const COLOR_UNIFORMS = {
  uPen: ARMOR_PALETTE.pen,
  uChance: ARMOR_PALETTE.chance,
  uNoPen: ARMOR_PALETTE.noPen,
  uRicochetColor: ARMOR_PALETTE.ricochet,
  uSpaced: ARMOR_PALETTE.spaced,
  uModule: ARMOR_PALETTE.module,
  uHollow: ARMOR_PALETTE.hollow
} as const;

export const createArmorMaterial = (values: ArmorShaderValues): ShaderMaterial =>
  new ShaderMaterial({
    vertexShader: ARMOR_VERTEX_SHADER,
    fragmentShader: ARMOR_FRAGMENT_SHADER,
    side: DoubleSide,
    uniforms: {
      ...Object.fromEntries(Object.entries(values).map(([name, value]) => [name, { value }])),
      ...Object.fromEntries(Object.entries(COLOR_UNIFORMS).map(([name, hex]) => [name, { value: new Color(hex).convertLinearToSRGB() }]))
    }
  });

export const applyShaderValues = ({ material, values }: ApplyShaderValuesInput) => {
  for (const [name, value] of Object.entries(values)) {
    material.uniforms[name].value = value;
  }
};
