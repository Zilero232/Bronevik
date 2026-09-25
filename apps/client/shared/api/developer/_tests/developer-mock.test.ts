import {
  API_KEY,
  apiErrorLogSchema,
  apiKeysSchema,
  apiUsageSchema,
  createdApiKeySchema,
  createdWebhookEndpointSchema,
  developerOverviewSchema,
  WEBHOOK,
  webhookDeliveriesSchema,
  webhookEndpointsSchema
} from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { openApiDocumentSchema } from '../developer.schemas';
import { mockDeveloper } from '../mock/developer.mock';
import mockSpec from '../mock/openapi-spec.json';

describe('mockDeveloper', () => {
  it('serves an overview, keys, usage and errors that match the shared contract', () => {
    const [key] = mockDeveloper.keys();

    expect(() => developerOverviewSchema.parse(mockDeveloper.overview())).not.toThrow();
    expect(() => apiKeysSchema.parse(mockDeveloper.keys())).not.toThrow();
    expect(() => apiUsageSchema.parse(mockDeveloper.usage({ id: key.id, days: 7 }))).not.toThrow();
    expect(() => apiErrorLogSchema.parse(mockDeveloper.errors())).not.toThrow();
  });

  it('returns one usage point per requested day', () => {
    const [key] = mockDeveloper.keys();

    [1, 7, 30].forEach((days) => expect(mockDeveloper.usage({ id: key.id, days }).history).toHaveLength(days));
  });

  it('creates a key whose secret starts with the listed prefix and hides revoked keys', () => {
    const created = createdApiKeySchema.parse(mockDeveloper.createKey({ name: 'Test' }));

    expect(created.secret.startsWith(created.key.prefix)).toBe(true);
    expect(created.key.prefix).toHaveLength(API_KEY.prefixLength);

    mockDeveloper.revokeKey(created.key.id);

    expect(mockDeveloper.keys().some(({ id }) => id === created.key.id)).toBe(false);
  });

  it('keeps webhooks and deliveries within the contract', () => {
    const created = createdWebhookEndpointSchema.parse(
      mockDeveloper.createWebhook({ url: 'https://example.org/hook', events: [...WEBHOOK.events], filter: { accountIds: [1] } })
    );

    expect(() => webhookEndpointsSchema.parse(mockDeveloper.webhooks())).not.toThrow();
    expect(() => webhookDeliveriesSchema.parse(mockDeveloper.deliveries(created.endpoint.id))).not.toThrow();
  });
});

describe('mock OpenAPI spec', () => {
  it('parses as an OpenAPI document with public v1 paths', () => {
    const spec = openApiDocumentSchema.parse(mockSpec);

    expect(Object.keys(spec.paths).length).toBeGreaterThan(0);
    expect(Object.keys(spec.paths).every((path) => path.startsWith('/v1/'))).toBe(true);
  });
});
