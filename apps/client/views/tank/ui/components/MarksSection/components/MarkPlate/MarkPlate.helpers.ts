import { Mark1Icon, Mark2Icon, Mark3Icon } from '@bronevik/icons';

import type { SpecVerdict } from '@/entities/tank/tank';

export const MARK_ICONS = { 1: Mark1Icon, 2: Mark2Icon, 3: Mark3Icon } as const;

export const thresholdVerdict = (delta: number): SpecVerdict => {
  if (delta === 0) {
    return 'same';
  }

  return delta > 0 ? 'worse' : 'better';
};
