import type { ChangeBaselineInput, ChangeVerdict, ChangeVerdictInput } from './change-verdict.types';

import { paramMeta } from '../param-key';

const EPSILON = 1e-9;

export const changeBaseline = ({ from, live }: ChangeBaselineInput): number | null => from ?? live;

export const changeVerdict = ({ param, from, to, live }: ChangeVerdictInput): ChangeVerdict => {
  const meta = paramMeta(param);
  const before = changeBaseline({ from, live });

  if (!meta || before === null || to === null || Math.abs(to - before) < EPSILON) {
    return 'neutral';
  }

  return to > before !== meta.isLowerBetter ? 'buff' : 'nerf';
};
