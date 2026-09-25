import { describe, expect, it } from 'vitest';

import { API_KEY, API_PLAN_LIMITS, WEBHOOK } from '../developer.constants';
import { apiPlanLimitsSchema, apiPlanSchema, createApiKeySchema, createWebhookEndpointSchema, webhookFilterSchema } from '../developer.schemas';

describe('developer schemas', () => {
  it('describes every plan with valid limits', () => {
    expect(Object.keys(API_PLAN_LIMITS).sort()).toEqual([...apiPlanSchema.options].sort());

    for (const limits of Object.values(API_PLAN_LIMITS)) {
      expect(apiPlanLimitsSchema.safeParse(limits).success).toBe(true);
    }
  });

  it('never lowers a limit on a more expensive plan', () => {
    const limits = apiPlanSchema.options.map((plan) => API_PLAN_LIMITS[plan]);

    limits.slice(1).forEach((plan, index) => {
      const cheaper = limits[index];

      expect(plan.requestsPerDay).toBeGreaterThanOrEqual(cheaper?.requestsPerDay ?? 0);
      expect(plan.requestsPerSecond).toBeGreaterThanOrEqual(cheaper?.requestsPerSecond ?? 0);
      expect(plan.webhooks).toBeGreaterThanOrEqual(cheaper?.webhooks ?? 0);
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
