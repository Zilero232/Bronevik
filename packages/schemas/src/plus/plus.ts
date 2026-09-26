import type { PlusLimitInput, PlusStateKind } from './plus.types';

import { PLUS_LIMITS } from './plus.constants';

export const plusLimit = ({ key, isPlus }: PlusLimitInput): number => {
  const limits: Record<'free' | 'plus', number> = PLUS_LIMITS[key];

  return limits[isPlus ? 'plus' : 'free'];
};

export const isPlusState = (state: PlusStateKind): boolean => state === 'trial' || state === 'active' || state === 'grace';
