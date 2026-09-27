import { Color, DoubleSide, ShaderMaterial } from 'three';

import type { ArmorShaderValues } from '@/entities/armor/armor-model';

import { ARMOR_PALETTE, ARMOR_SHADER } from '@/entities/armor/armor-model';

import type { ApplyShaderValuesInput } from './armor-material.types';

import { ARMOR_COLOR_UNIFORMS } from '../../config';

export const createArmorMaterial = (values: ArmorShaderValues): ShaderMaterial =>
  new ShaderMaterial({
    vertexShader: ARMOR_SHADER.vertex,
    fragmentShader: ARMOR_SHADER.fragment,
    side: DoubleSide,
    uniforms: {
      ...Object.fromEntries(Object.entries(values).map(([name, value]) => [name, { value }])),
      ...Object.fromEntries(
        Object.entries(ARMOR_COLOR_UNIFORMS).map(([name, face]) => [name, { value: new Color(ARMOR_PALETTE[face]).convertLinearToSRGB() }])
      )
    }
  });

export const applyShaderValues = ({ material, values }: ApplyShaderValuesInput) => {
  for (const [name, value] of Object.entries(values)) {
    material.uniforms[name].value = value;
  }
};
