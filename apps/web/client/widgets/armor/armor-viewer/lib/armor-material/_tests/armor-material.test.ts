import { describe, expect, it } from 'vitest';

import { armorShaderValues } from '@/entities/armor/armor-model';

import { ARMOR_COLOR_UNIFORMS } from '../../../config';
import { applyShaderValues, createArmorMaterial } from '../armor-material';

const shell = { kind: 'ARMOR_PIERCING', caliber: 100, penetration: 200 } as const;

describe('createArmorMaterial', () => {
  it('declares a uniform for every shader value and every palette colour', () => {
    const values = armorShaderValues({ shell, randomness: 0, hideSpaced: false });
    const material = createArmorMaterial(values);

    for (const name of [...Object.keys(values), ...Object.keys(ARMOR_COLOR_UNIFORMS)]) {
      expect(material.uniforms).toHaveProperty(name);
    }

    expect(material.uniforms.uPenetration.value).toBe(values.uPenetration);
  });
});

describe('applyShaderValues', () => {
  it('overwrites the live uniforms with the new values', () => {
    const material = createArmorMaterial(armorShaderValues({ shell, randomness: 0, hideSpaced: false }));
    const next = armorShaderValues({ shell: { ...shell, penetration: shell.penetration * 2 }, randomness: 0, hideSpaced: true });

    applyShaderValues({ material, values: next });

    expect(material.uniforms.uPenetration.value).toBe(next.uPenetration);
    expect(material.uniforms.uHideSpaced.value).toBe(next.uHideSpaced);
  });
});
