import { describe, expect, it } from 'vitest';

import { API_KEY, API_TIER_LIMITS, WEBHOOK } from '../developer.constants';
import { apiTierLimitsSchema, apiTierSchema, createApiKeySchema, createWebhookEndpointSchema, webhookFilterSchema } from '../developer.schemas';

describe('developer schemas', () => {
  it('describes every tier with valid limits', () => {
    expect(Object.keys(API_TIER_LIMITS).sort()).toEqual([...apiTierSchema.options].sort());

    for (const limits of Object.values(API_TIER_LIMITS)) {
      expect(apiTierLimitsSchema.safeParse(limits).success).toBe(true);
    }
  });

  it('never lowers a limit on a higher tier', () => {
    const limits = apiTierSchema.options.map((tier) => API_TIER_LIMITS[tier]);

    limits.slice(1).forEach((tier, index) => {
      const cheaper = limits[index];

      expect(tier.requestsPerDay).toBeGreaterThanOrEqual(cheaper?.requestsPerDay ?? 0);
      expect(tier.requestsPerSecond).toBeGreaterThanOrEqual(cheaper?.requestsPerSecond ?? 0);
      expect(tier.webhooks).toBeGreaterThanOrEqual(cheaper?.webhooks ?? 0);
    });
  });

  it('bounds the API key name', () => {
    expect(createApiKeySchema.safeParse({ name: ' ' }).success).toBe(false);
    expect(createApiKeySchema.safeParse({ name: 'x'.repeat(API_KEY.maxNameLength + 1) }).success).toBe(false);
  });

  it('accepts only https webhooks with at least one event', () => {
    const filter = { accountIds: [1] };

    expect(createWebhookEndpointSchema.safeParse({ url: 'https://example.com/hook', events: ['mark.gained'], filter }).success).toBe(true);
    expect(createWebhookEndpointSchema.safeParse({ url: 'http://example.com/hook', events: ['mark.gained'], filter }).success).toBe(false);
    expect(createWebhookEndpointSchema.safeParse({ url: 'https://example.com/hook', events: [], filter }).success).toBe(false);
  });

  it('refuses a webhook that follows nobody', () => {
    expect(webhookFilterSchema.safeParse({}).success).toBe(false);
    expect(webhookFilterSchema.safeParse({ accountIds: [], clanIds: [] }).success).toBe(false);
    expect(webhookFilterSchema.safeParse({ clanIds: [1] }).success).toBe(true);
  });

  it('caps the ids a webhook follows', () => {
    const ids = Array.from({ length: WEBHOOK.maxFilterIds + 1 }, (_, index) => index + 1);

    expect(webhookFilterSchema.safeParse({ accountIds: ids }).success).toBe(false);
  });
});
