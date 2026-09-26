'use client';

import type { ReportMatchInput, Tournament } from '@/entities/tournament/tournament';

import { useCommunityViewer } from '@/features/community/viewer';

import { reportTournamentMatch } from '../../../api';
import { bracketColumns, championOf } from '../../../lib/bracket-columns';
import { useTournamentMutation } from '../use-tournament-mutation';

export const useTournamentBracket = (tournament: Tournament) => {
  const { userId } = useCommunityViewer();
  const report = useTournamentMutation({ mutationFn: (input: ReportMatchInput) => reportTournamentMatch(input), successKey: 'reported' });

  const { bracket, participants } = tournament;

  return {
    columns: bracket ? bracketColumns({ bracket, participants }) : [],
    champion: bracket ? championOf({ bracket, participants }) : null,
    canReport: tournament.status === 'running' && userId !== null && userId === tournament.organizerUserId,
    isReporting: report.isPending,
    onReport: ({ round, index, winner }: Omit<ReportMatchInput, 'id'>) => report.mutate({ id: tournament.id, round, index, winner })
  };
};
