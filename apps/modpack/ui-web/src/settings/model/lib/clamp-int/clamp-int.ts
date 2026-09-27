import type { ClampIntInput } from './clamp-int.types';

export const clampInt = ({ raw, min, max }: ClampIntInput): number | null => {
  const parsed = Number.parseInt(raw.trim(), 10);

  if (Number.isNaN(parsed)) {
    return null;
  }

  const low = min ?? Number.MIN_SAFE_INTEGER;
  const high = max ?? Number.MAX_SAFE_INTEGER;

  return Math.min(Math.max(parsed, low), high);
};
