import { mapValues } from 'remeda';
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
      ...mapValues(values, (value) => ({ value })),
      ...mapValues(ARMOR_COLOR_UNIFORMS, (face) => ({ value: new Color(ARMOR_PALETTE[face]).convertLinearToSRGB() }))
    }
  });

export const applyShaderValues = ({ material, values }: ApplyShaderValuesInput) => {
  for (const [name, value] of Object.entries(values)) {
    material.uniforms[name].value = value;
  }
};
