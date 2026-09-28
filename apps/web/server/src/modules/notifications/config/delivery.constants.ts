import type { NotificationChannel, NotificationEvent } from '../../../../generated';

export const NOTIFICATION_DEFAULTS = {
  channels: ['site'],
  events: ['moeGained', 'moeThresholdDropped', 'sessionFinished', 'goalReached', 'replayOverflow', 'tankLevelUp', 'tankChallengeDone'],
  sessionReport: true,
  weeklyDigest: false
} as const;

export const NOTIFICATION_ROUTING: Readonly<Record<'digestChannels' | 'eventChannels' | 'quietChannels', readonly NotificationChannel[]>> = {
  eventChannels: ['site', 'telegram', 'webPush'],
  digestChannels: ['email', 'telegram'],
  quietChannels: ['telegram', 'webPush']
};

export const NOTIFICATION_ALWAYS_IN_INBOX: readonly NotificationEvent[] = ['replayOverflow', 'tankLevelUp', 'tankChallengeDone'];

export const NOTIFICATION_SELF_OPTED: readonly NotificationEvent[] = [
  'watchlistDigest',
  'competitionFinished',
  'streamerLive',
  'lestaRelinkRequired'
];

export const NOTIFICATION_EMAIL_EVENTS: readonly NotificationEvent[] = ['watchlistDigest', 'lestaRelinkRequired'];

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
