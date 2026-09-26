import { SHELL_KINDS, SHELL_RULES } from '@otmetki/gamedata';
import { describe, expect, it } from 'vitest';

import { armorShaderValues } from '../armor-shader';
import { ARMOR_SHADER } from '../armor-shader.glsl';

const shellOf = (kind: (typeof SHELL_KINDS)[number]) => ({ kind, caliber: 100, penetration: 200 });

describe('armorShaderValues', () => {
  it('passes each shell kind its own normalisation and ricochet angle', () => {
    for (const kind of SHELL_KINDS) {
      const values = armorShaderValues({ shell: shellOf(kind), randomness: 0.25, hideSpaced: false });

      expect(values.uNormalization).toBe(SHELL_RULES[kind].normalization);
      expect(values.uCaliberRules).toBe(SHELL_RULES[kind].caliberRules ? 1 : 0);
    }
  });

  it('pushes the ricochet angle out of reach for HE and flags it as HE', () => {
    const values = armorShaderValues({ shell: shellOf('HIGH_EXPLOSIVE'), randomness: 0.25, hideSpaced: false });

    expect(values.uRicochet).toBeGreaterThan(90);
    expect(values.uHighExplosive).toBe(1);
  });

  it('declares every uniform the fragment shader reads', () => {
    const declared = [...ARMOR_SHADER.fragment.matchAll(/uniform float (\w+);/g)].map(([, name]) => name);

    const provided = Object.keys(armorShaderValues({ shell: shellOf('ARMOR_PIERCING'), randomness: 0, hideSpaced: false }));

    expect(new Set(declared)).toEqual(new Set(provided));
  });

  it('switches spaced plates off only when asked', () => {
    const shell = shellOf('ARMOR_PIERCING');

    expect(armorShaderValues({ shell, randomness: 0, hideSpaced: true }).uHideSpaced).toBe(1);
    expect(armorShaderValues({ shell, randomness: 0, hideSpaced: false }).uHideSpaced).toBe(0);
  });

  it('feeds the per-face attributes the fragment shader colours by', () => {
    expect(ARMOR_SHADER.vertex).toContain('attribute float aThickness');
    expect(ARMOR_SHADER.vertex).toContain('attribute float aFlags');
  });
});
