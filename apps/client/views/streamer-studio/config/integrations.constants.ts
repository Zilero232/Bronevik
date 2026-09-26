import type { ConnectableProvider, StreamerProvider } from '@/shared/api/streamers';

export const CONNECTABLE_PROVIDERS: readonly { provider: StreamerProvider; path: ConnectableProvider }[] = [
  { provider: 'donationAlerts', path: 'donation-alerts' },
  { provider: 'twitch', path: 'twitch' }
];

export const UPCOMING_PROVIDERS: readonly StreamerProvider[] = ['vkPlayLive', 'youtube'];

export const INTEGRATION_BADGE = {
  on: { tone: 'success', label: 'connected' },
  off: { tone: 'neutral', label: 'notConnected' },
  soon: { tone: 'steel', label: 'soon' }
} as const;
