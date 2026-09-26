export const API_PLAN_LIMITS = {
  free: { requestsPerDay: 10_000, requestsPerSecond: 5, webhooks: 1 },
  pro: { requestsPerDay: 250_000, requestsPerSecond: 25, webhooks: 10 },
  partner: { requestsPerDay: 2_000_000, requestsPerSecond: 100, webhooks: 50 }
} as const;

export const API_KEY = {
  header: 'X-API-Key',
  prefixLength: 8,
  maxNameLength: 64,
  maxActivePerUser: 10
} as const;

export const WEBHOOK = {
  events: ['mark.gained', 'session.ended', 'clan.member_changed'],
  signatureHeader: 'webhook-signature',
  timestampHeader: 'webhook-timestamp',
  deliveryHeader: 'webhook-id',
  eventHeader: 'X-Otmetki-Event',
  signatureScheme: 'v1',
  secretPrefix: 'whsec_',
  maxFilterIds: 100
} as const;
