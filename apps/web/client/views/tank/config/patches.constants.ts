import type { TankPatchVerdict } from '@otmetki/schemas';

import type { BadgeTone } from '@/ui-kit';

export const VERDICT_TONES = {
  new: 'accent',
  buff: 'success',
  nerf: 'danger',
  mixed: 'warning',
  changed: 'neutral'
} as const satisfies Record<TankPatchVerdict, BadgeTone>;
