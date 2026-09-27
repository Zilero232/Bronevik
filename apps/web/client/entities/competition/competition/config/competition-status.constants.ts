import type { CompetitionSource, CompetitionStatus } from '@otmetki/schemas';

import type { BadgeTone } from '@/ui-kit';

export const COMPETITION_STATUS_TONE = {
  upcoming: 'accent',
  running: 'success',
  finished: 'steel'
} as const satisfies Record<CompetitionStatus, BadgeTone>;

export const COMPETITION_SOURCE_TONE = {
  mod: 'success',
  snapshots: 'steel',
  none: 'neutral'
} as const satisfies Record<CompetitionSource, BadgeTone>;
