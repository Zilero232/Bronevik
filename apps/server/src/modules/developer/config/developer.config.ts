import type { ApiPlan, ApiPlanLimits, WebhookEvent } from '@bronevik/schemas';

import { API_PLAN_LIMITS } from '@bronevik/schemas';

import type { WebhookEvent as DbWebhookEvent } from '../../../../generated';

export const API_PLANS: Record<ApiPlan, ApiPlanLimits> = API_PLAN_LIMITS;

export const API_KEY_FORMAT = {
  label: 'brv',
  prefixBytes: 6,
  secretBytes: 32,
  pattern: /^brv_([\w-]{8})_([\w-]{43})$/
} as const;

export const API_KEY_CACHE = {
  ttlMs: 30_000,
  maxEntries: 5_000
} as const;

export const API_RATE_LIMIT = {
  secondPrefix: 'bronevik:api:rps',
  dayPrefix: 'bronevik:api:quota',
  secondWindow: 1,
  dayWindow: 86_400,
  headers: {
    limit: 'X-RateLimit-Limit',
    remaining: 'X-RateLimit-Remaining',
    dailyLimit: 'X-RateLimit-Daily-Limit',
    dailyRemaining: 'X-RateLimit-Daily-Remaining',
    retryAfter: 'Retry-After'
  }
} as const;

export const API_USAGE = {
  flushIntervalMs: 10_000,
  errorMessageMaxLength: 500,
  errorLogLimit: 100,
  topEndpoints: 10,
  unmatchedEndpoint: 'unmatched'
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

export const WEBHOOK_EVENT_FROM_DB: Record<DbWebhookEvent, WebhookEvent | null> = {
  moeGained: 'mark.gained',
  sessionFinished: 'session.ended',
  clanRosterChanged: 'clan.member_changed',
  moeThresholdDropped: null
};

export const WEBHOOK_DELIVERY = {
  maxAttempts: 6,
  backoffMs: 30_000,
  timeoutMs: 10_000,
  disableAfterFailures: 20,
  responseBodyMaxLength: 1_000,
  secretBytes: 32,
  userAgent: 'Bronevik-Webhooks/1.0 (+https://bronevik.app)',
  deliveriesShown: 50
} as const;

export const SESSION_CLOSE = {
  idleMinutes: 30,
  batchSize: 500
} as const;

export const PUBLIC_API = {
  tagPrefix: 'v1-'
} as const;
