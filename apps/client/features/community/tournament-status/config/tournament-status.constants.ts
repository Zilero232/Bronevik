import type { TournamentStatus } from '@/entities/tournament/tournament';
import type { BadgeTone } from '@/ui-kit';

export const TOURNAMENT_STATUSES = ['registration', 'running', 'finished', 'cancelled', 'draft'] as const satisfies readonly TournamentStatus[];

export const TOURNAMENT_STATUS_TONE = {
  draft: 'neutral',
  registration: 'accent',
  running: 'success',
  finished: 'steel',
  cancelled: 'danger'
} as const satisfies Record<TournamentStatus, BadgeTone>;
