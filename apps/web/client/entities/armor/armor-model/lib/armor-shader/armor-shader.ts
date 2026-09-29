import { ERF_APPROXIMATION, PENETRATION, SHELL_RULES } from '@otmetki/gamedata';

import type { ArmorShaderInput, ArmorShaderValues } from './armor-shader.types';

import { ARMOR_SHADING } from '../../config';

export const armorShaderValues = ({ shell, randomness, hideSpaced, heatmap }: ArmorShaderInput): ArmorShaderValues => {
  const rules = SHELL_RULES[shell.kind];
  const { p, a1, a2, a3, a4, a5 } = ERF_APPROXIMATION;

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
    uHideSpaced: hideSpaced ? 1 : 0,
    uHeatmap: heatmap ? 1 : 0,
    uSigmaShare: PENETRATION.sigmaShare,
    uErf: [p, a1, a2, a3, a4, a5]
  };
};
