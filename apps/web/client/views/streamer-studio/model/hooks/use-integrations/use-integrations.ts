'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { getIntegrations } from '@/entities/streamer/streamer';
import { QUERY_KEYS } from '@/shared/constants';

import { connectIntegration, disconnectIntegration, setTwitchPredictions } from '../../../api';

export const useIntegrations = () => useQuery({ queryKey: QUERY_KEYS.me.streamer.integrations, queryFn: getIntegrations });

export const useConnectIntegration = () =>
  useMutation({
    mutationFn: connectIntegration,
    onSuccess: (url) => window.location.assign(url),
    meta: { errorKey: 'streamer.studio.toast.connectFailed' }
  });

export const useSetPredictions = () =>
  useMutation({
    mutationFn: setTwitchPredictions,
    meta: {
      successKey: 'streamer.studio.toast.predictionsSaved',
      errorKey: 'streamer.studio.toast.failed',
      invalidates: [QUERY_KEYS.me.streamer.integrations]
    }
  });

export const useDisconnectIntegration = () =>
  useMutation({
    mutationFn: disconnectIntegration,
    meta: {
      successKey: 'streamer.studio.toast.disconnected',
      errorKey: 'streamer.studio.toast.failed',
      invalidates: [QUERY_KEYS.me.streamer.integrations]
    }
  });
