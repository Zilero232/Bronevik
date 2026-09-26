import type { ApiPlan, ApiPlanLimits, WebhookEvent } from '@bronevik/schemas';

import { API_PLAN_LIMITS } from '@bronevik/schemas';
import { millisecondsInDay } from 'date-fns/constants';

import type { WebhookEvent as DbWebhookEvent } from '../../../../generated';

export const API_PLANS: Record<ApiPlan, ApiPlanLimits> = API_PLAN_LIMITS;

export const API_KEY_POLICY = {
  quotaRefillMs: millisecondsInDay,
  planCacheTtlMs: 300_000,
  planCacheMaxEntries: 5_000,
  quotaCodes: new Set<string>(['USAGE_EXCEEDED']),
  revokedCodes: new Set<string>(['KEY_DISABLED', 'KEY_EXPIRED'])
} as const;

export const API_USAGE_REPORT = {
  errorLogLimit: 100,
  topEndpoints: 10
} as const;

export const DEVELOPER_PLAN = {
  proProducts: ['developerPro'],
  activeStatuses: ['active', 'trialing', 'pastDue']
} as const;

export const WEBHOOK_EVENT_TO_DB = {
  'mark.gained': 'moeGained',
  'session.ended': 'sessionFinished',
  'clan.member_changed': 'clanRosterChanged'
} as const satisfies Record<WebhookEvent, DbWebhookEvent>;

export const WEBHOOK_EVENT_FROM_DB = {
  moeGained: 'mark.gained',
  sessionFinished: 'session.ended',
  clanRosterChanged: 'clan.member_changed',
  moeThresholdDropped: null
} as const satisfies Record<DbWebhookEvent, WebhookEvent | null>;

export const WEBHOOK_DELIVERY = {
  maxAttempts: 6,
  backoffMs: 30_000,
  timeoutMs: 10_000,
  disableAfterFailures: 20,
  responseBodyMaxLength: 1_000,
  secretBytes: 32,
  blockedResponse: 'refused: the webhook host resolves to a non-public address',
  userAgent: 'Bronevik-Webhooks/1.0 (+https://bronevik.app)',
  deliveriesShown: 50
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
