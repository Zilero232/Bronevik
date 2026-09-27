import type { ShaderMaterial } from 'three';

import type { ArmorShaderValues } from '@/entities/armor/armor-model';

export type ApplyShaderValuesInput = {
  material: ShaderMaterial;
  values: ArmorShaderValues;
};
