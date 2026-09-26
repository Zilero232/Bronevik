import type { ConnectableProvider, StreamerIntegration } from '@/entities/streamer/streamer';

export type UseIntegrationCardInput = {
  integration: StreamerIntegration | null;
  path: ConnectableProvider | null;
};
