'use client';

import { useMutation } from '@tanstack/react-query';

import type { Tournament } from '@/entities/tournament/tournament';

import { useCommunityViewer } from '@/entities/auth/session';
import { communityErrorKey } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import { cancelTournament, openTournament, startTournament } from '../../../api';
import { TOURNAMENT_PAGE } from '../../../config';

export const useOrganizerActions = (tournament: Tournament) => {
  const { userId } = useCommunityViewer();
  const open = useMutation({
    mutationFn: openTournament,
    meta: { successKey: 'tournaments.toast.opened', errorKey: communityErrorKey('tournaments'), invalidates: [QUERY_KEYS.tournaments.all] }
  });

  const start = useMutation({
    mutationFn: startTournament,
    meta: { successKey: 'tournaments.toast.started', errorKey: communityErrorKey('tournaments'), invalidates: [QUERY_KEYS.tournaments.all] }
  });

  const cancel = useMutation({
    mutationFn: cancelTournament,
    meta: { successKey: 'tournaments.toast.cancelled', errorKey: communityErrorKey('tournaments'), invalidates: [QUERY_KEYS.tournaments.all] }
  });

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
