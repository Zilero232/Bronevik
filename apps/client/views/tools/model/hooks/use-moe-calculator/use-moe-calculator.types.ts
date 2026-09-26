import type { MoeTargetValue } from '../../../config';

export type MoeValues = {
  percent: number;
  damage: number | null;
  target: MoeTargetValue;
};
