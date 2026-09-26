import type { TankPatchVerdict } from '@bronevik/schemas';

import type { BadgeTone } from '@/ui-kit';

export const VERDICT_TONES: Record<TankPatchVerdict, BadgeTone> = {
  new: 'accent',
  buff: 'success',
  nerf: 'danger',
  mixed: 'warning',
  changed: 'neutral'
};
