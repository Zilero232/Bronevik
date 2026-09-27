import type { ArmorShellState } from '../../model/armor-model.types';

export type ArmorShaderInput = ArmorShellState & {
  hideSpaced: boolean;
};

export type ArmorShaderValues = {
  uPenetration: number;
  uCaliber: number;
  uNormalization: number;
  uRicochet: number;
  uRandomness: number;
  uCaliberRules: number;
  uHighExplosive: number;
  uTwoCaliberRatio: number;
  uTwoCaliberFactor: number;
  uOvermatchRatio: number;
  uAmbient: number;
  uDiffuse: number;
  uHideSpaced: number;
};
