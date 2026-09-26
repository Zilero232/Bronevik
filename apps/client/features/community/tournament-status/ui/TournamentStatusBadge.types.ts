import type { TournamentStatus } from '@/entities/tournament/tournament';

export type TournamentStatusBadgeProps = {
  status: TournamentStatus;
  className?: string;
};
