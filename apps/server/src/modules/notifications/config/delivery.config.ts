import type { NotificationChannel } from '../../../../generated';

export const NOTIFICATION_DEFAULTS = {
  channels: ['site'],
  events: ['moeGained', 'moeThresholdDropped', 'sessionFinished', 'goalReached'],
  sessionReport: true,
  weeklyDigest: false
} as const;

export const NOTIFICATION_ROUTING: Readonly<Record<'digestChannels' | 'eventChannels' | 'quietChannels', readonly NotificationChannel[]>> = {
  eventChannels: ['site', 'telegram', 'webPush'],
  digestChannels: ['email', 'telegram'],
  quietChannels: ['telegram', 'webPush']
};

export const NOTIFICATION_DELIVERY = {
  concurrency: 8,
  fanoutChunk: 500,
  attempts: 4,
  backoffMs: 10_000
} as const;

export const WEB_PUSH: Readonly<{ ttlSeconds: number; goneStatuses: readonly number[] }> = {
  ttlSeconds: 24 * 60 * 60,
  goneStatuses: [404, 410]
};
