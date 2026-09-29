import type { BattleResult } from '@otmetki/schemas';

import type { BadgeTone } from '@/ui-kit';

export const REPLAY_RESULT_TONE = {
  win: 'success',
  loss: 'danger',
  draw: 'neutral'
} as const satisfies Record<BattleResult, BadgeTone>;
