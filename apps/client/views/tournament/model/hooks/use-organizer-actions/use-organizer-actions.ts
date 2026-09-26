'use client';

import type { Tournament } from '@/shared/api/tournaments';

import { useCommunityViewer } from '@/features/community/viewer';
import { cancelTournament, openTournament, startTournament } from '@/shared/api/tournaments';

import { TOURNAMENT_PAGE } from '../../../config';
import { useTournamentMutation } from '../use-tournament-mutation';

export const useOrganizerActions = (tournament: Tournament) => {
  const { userId } = useCommunityViewer();
  const open = useTournamentMutation({ mutationFn: openTournament, successKey: 'opened' });
  const start = useTournamentMutation({ mutationFn: startTournament, successKey: 'started' });
  const cancel = useTournamentMutation({ mutationFn: cancelTournament, successKey: 'cancelled' });

  const { status } = tournament;

  return {
    isOrganizer: userId !== null && userId === tournament.organizerUserId,
    canOpen: status === 'draft',
    canStart: status === 'registration',
    hasEnoughToStart: tournament.participants.length >= TOURNAMENT_PAGE.minParticipants,
    canCancel: status !== 'finished' && status !== 'cancelled',
    isBusy: open.isPending || start.isPending || cancel.isPending,
    onOpen: () => open.mutate(tournament.id),
    onStart: () => start.mutate(tournament.id),
    onCancel: () => cancel.mutate(tournament.id)
  };
};
