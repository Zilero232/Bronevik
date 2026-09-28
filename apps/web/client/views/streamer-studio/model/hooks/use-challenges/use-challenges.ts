'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { activateChallenge, cancelChallenge, createChallenge, getChallenges } from '../../../api';

export const useChallenges = () => useQuery({ queryKey: QUERY_KEYS.me.streamer.challenges, queryFn: getChallenges });

export const useCreateChallenge = () =>
  useMutation({
    mutationFn: createChallenge,
    meta: {
      successKey: 'streamer.studio.toast.challengeCreated',
      errorKey: 'streamer.studio.toast.failed',
      invalidates: [QUERY_KEYS.me.streamer.challenges]
    }
  });

export const useActivateChallenge = () =>
  useMutation({
    mutationFn: activateChallenge,
    meta: {
      successKey: 'streamer.studio.toast.challengeActivated',
      errorKey: 'streamer.studio.toast.failed',
      invalidates: [QUERY_KEYS.me.streamer.challenges]
    }
  });

export const useCancelChallenge = () =>
  useMutation({
    mutationFn: cancelChallenge,
    meta: {
      successKey: 'streamer.studio.toast.challengeCancelled',
      errorKey: 'streamer.studio.toast.failed',
      invalidates: [QUERY_KEYS.me.streamer.challenges]
    }
  });
