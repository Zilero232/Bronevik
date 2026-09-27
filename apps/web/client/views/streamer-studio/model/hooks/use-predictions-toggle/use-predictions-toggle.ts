'use client';

import type { StreamerIntegration } from '@/entities/streamer/streamer';

import { useConnectIntegration, useSetPredictions } from '../use-integrations';

export const usePredictionsToggle = (integration: StreamerIntegration) => {
  const save = useSetPredictions();
  const connect = useConnectIntegration();

  return {
    isEnabled: integration.predictions,
    canPredict: integration.canPredict,
    isPending: save.isPending || connect.isPending,
    onToggle: (enabled: boolean) => save.mutate(enabled),
    onReconnect: () => connect.mutate('twitch')
  };
};
