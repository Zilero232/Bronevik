import { clamp } from 'remeda';

import type { ClampIntInput } from './clamp-int.types';

export const clampInt = ({ raw, min, max }: ClampIntInput): number | null => {
  const parsed = Number.parseInt(raw.trim(), 10);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return clamp(parsed, { min: min ?? Number.MIN_SAFE_INTEGER, max: max ?? Number.MAX_SAFE_INTEGER });
};
