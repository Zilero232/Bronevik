import type { ArmorShellState } from '../../model/armor-model.types';

export type ClassifyFaceInput = ArmorShellState & {
  thickness: number;
  flags: number;
  angle: number;
};
