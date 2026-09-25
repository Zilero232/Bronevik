import type { ConnectableProvider, StreamerIntegration, StreamerProvider } from '@/shared/api/streamers';

export type IntegrationCardProps = {
  provider: StreamerProvider;
  path: ConnectableProvider | null;
  integration: StreamerIntegration | null;
  isLoading: boolean;
};
