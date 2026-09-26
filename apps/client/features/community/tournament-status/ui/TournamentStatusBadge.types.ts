import type { TournamentStatus } from '@/shared/api/tournaments';

export type TournamentStatusBadgeProps = {
  status: TournamentStatus;
  className?: string;
};
