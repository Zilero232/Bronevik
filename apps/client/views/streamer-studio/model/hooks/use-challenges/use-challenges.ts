'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { activateChallenge, cancelChallenge, createChallenge, getChallenges } from '../../../api';
import { useStudioMutation } from '../use-studio-mutation';

export const useChallenges = () => useQuery({ queryKey: QUERY_KEYS.me.streamer.challenges, queryFn: getChallenges });

export const useCreateChallenge = () =>
  useStudioMutation({ mutationFn: createChallenge, queryKey: QUERY_KEYS.me.streamer.challenges, successKey: 'challengeCreated' });

export const useActivateChallenge = () =>
  useStudioMutation({ mutationFn: activateChallenge, queryKey: QUERY_KEYS.me.streamer.challenges, successKey: 'challengeActivated' });

export const useCancelChallenge = () =>
  useStudioMutation({ mutationFn: cancelChallenge, queryKey: QUERY_KEYS.me.streamer.challenges, successKey: 'challengeCancelled' });
