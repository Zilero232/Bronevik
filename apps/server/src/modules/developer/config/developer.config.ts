import type { ApiTier, ApiTierLimits, WebhookEvent } from '@otmetki/schemas';

import { API_TIER_LIMITS } from '@otmetki/schemas';
import { millisecondsInDay } from 'date-fns/constants';

import type { NotificationEvent } from '../../../../generated';

export const API_TIERS: Record<ApiTier, ApiTierLimits> = API_TIER_LIMITS;

export const API_KEY_POLICY = {
  quotaRefillMs: millisecondsInDay,
  tierCacheTtlMs: 300_000,
  tierCacheMaxEntries: 5_000,
  quotaCodes: new Set<string>(['USAGE_EXCEEDED']),
  revokedCodes: new Set<string>(['KEY_DISABLED', 'KEY_EXPIRED'])
} as const;

export const API_USAGE_REPORT = {
  errorLogLimit: 100,
  topEndpoints: 10
} as const;

export const WEBHOOK_DB_EVENTS = [
  'moeGained',
  'sessionFinished',
  'clanRosterChanged',
  'moeThresholdDropped'
] as const satisfies readonly NotificationEvent[];

export const WEBHOOK_EVENT_TO_DB = {
  'mark.gained': 'moeGained',
  'session.ended': 'sessionFinished',
  'clan.member_changed': 'clanRosterChanged'
} as const satisfies Record<WebhookEvent, (typeof WEBHOOK_DB_EVENTS)[number]>;

export const WEBHOOK_EVENT_FROM_DB = {
  moeGained: 'mark.gained',
  sessionFinished: 'session.ended',
  clanRosterChanged: 'clan.member_changed',
  moeThresholdDropped: null
} as const satisfies Record<(typeof WEBHOOK_DB_EVENTS)[number], WebhookEvent | null>;

export const WEBHOOK_DELIVERY = {
  maxAttempts: 6,
  backoffMs: 30_000,
  timeoutMs: 10_000,
  disableAfterFailures: 20,
  responseBodyMaxLength: 1_000,
  secretBytes: 32,
  blockedResponse: 'refused: the webhook host resolves to a non-public address',
  userAgent: 'Otmetki-Webhooks/1.0 (+https://triotmetki.ru)',
  deliveriesShown: 50,
  redriveAfterMinutes: 15,
  redriveBatch: 500
} as const;

export const SESSION_CLOSE = {
  idleMinutes: 30,
  batchSize: 500
} as const;

export const WEBHOOK_URL = {
  protocol: 'https:',
  allowedRange: 'unicast',
  blockedHostSuffixes: ['.localhost', '.local', '.internal']
} as const;
