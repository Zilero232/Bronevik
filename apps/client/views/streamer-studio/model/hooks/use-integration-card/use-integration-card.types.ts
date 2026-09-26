import type { ConnectableProvider, StreamerIntegration } from '@/shared/api/streamers';

export type UseIntegrationCardInput = {
  integration: StreamerIntegration | null;
  path: ConnectableProvider | null;
};
