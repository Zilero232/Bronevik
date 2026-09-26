import type { ConnectableProvider, StreamerIntegration, StreamerProvider } from '@/entities/streamer/streamer';

export type IntegrationCardProps = {
  provider: StreamerProvider;
  path: ConnectableProvider | null;
  integration: StreamerIntegration | null;
  isLoading: boolean;
};
