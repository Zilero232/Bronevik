'use client';

import { useMutation } from '@tanstack/react-query';

import type { ReportMatchInput, Tournament } from '@/entities/tournament/tournament';

import { useCommunityViewer } from '@/entities/auth/session';
import { communityErrorKey } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import { reportTournamentMatch } from '../../../api';
import { bracketColumns, championOf } from '../../../lib/bracket-columns';

export const useTournamentBracket = (tournament: Tournament) => {
  const { userId } = useCommunityViewer();
  const report = useMutation({
    mutationFn: (input: ReportMatchInput) => reportTournamentMatch(input),
    meta: { successKey: 'tournaments.toast.reported', errorKey: communityErrorKey('tournaments'), invalidates: [QUERY_KEYS.tournaments.all] }
  });

  const { bracket, participants } = tournament;

  return {
    columns: bracket ? bracketColumns({ bracket, participants }) : [],
    champion: bracket ? championOf({ bracket, participants }) : null,
    canReport: tournament.status === 'running' && userId !== null && userId === tournament.organizerUserId,
    isReporting: report.isPending,
    onReport: ({ round, index, winner }: Omit<ReportMatchInput, 'id'>) => report.mutate({ id: tournament.id, round, index, winner })
  };
};
