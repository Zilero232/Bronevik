import type { ConnectableProvider, StreamerProvider } from '@/entities/streamer/streamer';

export const CONNECTABLE_PROVIDERS = [
  { provider: 'donationAlerts', path: 'donation-alerts' },
  { provider: 'twitch', path: 'twitch' }
] as const satisfies readonly { provider: StreamerProvider; path: ConnectableProvider }[];

export const UPCOMING_PROVIDERS = ['vkPlayLive', 'youtube'] as const satisfies readonly StreamerProvider[];

export const INTEGRATION_BADGE = {
  on: { tone: 'success', label: 'connected' },
  off: { tone: 'neutral', label: 'notConnected' },
  soon: { tone: 'steel', label: 'soon' }
} as const;
