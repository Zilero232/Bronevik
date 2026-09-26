import { PENETRATION, SHELL_RULES } from '@bronevik/gamedata';

import type { ArmorShaderInput, ArmorShaderValues } from './armor-shader.types';

import { ARMOR_SHADING } from '../../config';

export const armorShaderValues = ({ shell, randomness, hideSpaced }: ArmorShaderInput): ArmorShaderValues => {
  const rules = SHELL_RULES[shell.kind];

  return {
    uPenetration: shell.penetration,
    uCaliber: shell.caliber,
    uNormalization: rules.normalization,
    uRicochet: rules.ricochetAngle ?? ARMOR_SHADING.neverRicochets,
    uRandomness: randomness,
    uCaliberRules: rules.caliberRules ? 1 : 0,
    uHighExplosive: rules.ricochetAngle === null ? 1 : 0,
    uTwoCaliberRatio: PENETRATION.twoCaliberRatio,
    uTwoCaliberFactor: PENETRATION.twoCaliberFactor,
    uOvermatchRatio: PENETRATION.overmatchRatio,
    uAmbient: ARMOR_SHADING.ambient,
    uDiffuse: ARMOR_SHADING.diffuse,
    uHideSpaced: hideSpaced ? 1 : 0
  };
};
