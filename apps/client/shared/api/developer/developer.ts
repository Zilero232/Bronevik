import type {
  ApiErrorLog,
  ApiKeys,
  ApiUsage,
  CreateApiKeyInput,
  CreatedApiKey,
  CreatedWebhookEndpoint,
  CreateWebhookEndpointInput,
  DeveloperOverview,
  WebhookDeliveries,
  WebhookEndpoint,
  WebhookEndpoints
} from '@bronevik/schemas';

import {
  apiErrorLogSchema,
  apiKeysSchema,
  apiUsageSchema,
  createdApiKeySchema,
  createdWebhookEndpointSchema,
  developerOverviewSchema,
  webhookDeliveriesSchema,
  webhookEndpointSchema,
  webhookEndpointsSchema
} from '@bronevik/schemas';

import type { ApiKeyUsageInput, OpenApiDocument, UpdateWebhookInput } from './developer.types';

import { api } from '../http';
import { fromSource } from '../source';
import { DEVELOPER_PATHS } from './developer.constants';
import { openApiDocumentSchema } from './developer.schemas';
import { mockDeveloper } from './mock/developer.mock';
import mockSpec from './mock/openapi-spec.json';

const WITH_SESSION = { withCredentials: true } as const;

export const getDeveloperOverview = (): Promise<DeveloperOverview> =>
  fromSource({
    mock: () => developerOverviewSchema.parse(mockDeveloper.overview()),
    fetch: async () => developerOverviewSchema.parse((await api.get(DEVELOPER_PATHS.overview, WITH_SESSION)).data)
  });

export const getApiKeys = (): Promise<ApiKeys> =>
  fromSource({
    mock: () => apiKeysSchema.parse(mockDeveloper.keys()),
    fetch: async () => apiKeysSchema.parse((await api.get(DEVELOPER_PATHS.keys, WITH_SESSION)).data)
  });

export const createApiKey = (input: CreateApiKeyInput): Promise<CreatedApiKey> =>
  fromSource({
    mock: () => createdApiKeySchema.parse(mockDeveloper.createKey(input)),
    fetch: async () => createdApiKeySchema.parse((await api.post(DEVELOPER_PATHS.keys, input, WITH_SESSION)).data)
  });

export const revokeApiKey = (id: string): Promise<void> =>
  fromSource({
    mock: () => mockDeveloper.revokeKey(id),
    fetch: async () => {
      await api.delete(DEVELOPER_PATHS.key(id), WITH_SESSION);
    }
  });

export const getApiKeyUsage = ({ id, days }: ApiKeyUsageInput): Promise<ApiUsage> =>
  fromSource({
    mock: () => apiUsageSchema.parse(mockDeveloper.usage({ id, days })),
    fetch: async () => apiUsageSchema.parse((await api.get(DEVELOPER_PATHS.usage(id), { ...WITH_SESSION, params: { days } })).data)
  });

export const getApiKeyErrors = (id: string): Promise<ApiErrorLog> =>
  fromSource({
    mock: () => apiErrorLogSchema.parse(mockDeveloper.errors()),
    fetch: async () => apiErrorLogSchema.parse((await api.get(DEVELOPER_PATHS.errors(id), WITH_SESSION)).data)
  });

export const getWebhooks = (): Promise<WebhookEndpoints> =>
  fromSource({
    mock: () => webhookEndpointsSchema.parse(mockDeveloper.webhooks()),
    fetch: async () => webhookEndpointsSchema.parse((await api.get(DEVELOPER_PATHS.webhooks, WITH_SESSION)).data)
  });

export const createWebhook = (input: CreateWebhookEndpointInput): Promise<CreatedWebhookEndpoint> =>
  fromSource({
    mock: () => createdWebhookEndpointSchema.parse(mockDeveloper.createWebhook(input)),
    fetch: async () => createdWebhookEndpointSchema.parse((await api.post(DEVELOPER_PATHS.webhooks, input, WITH_SESSION)).data)
  });

export const updateWebhook = ({ id, ...patch }: UpdateWebhookInput): Promise<WebhookEndpoint> =>
  fromSource({
    mock: () => webhookEndpointSchema.parse(mockDeveloper.updateWebhook({ id, ...patch })),
    fetch: async () => webhookEndpointSchema.parse((await api.patch(DEVELOPER_PATHS.webhook(id), patch, WITH_SESSION)).data)
  });

export const removeWebhook = (id: string): Promise<void> =>
  fromSource({
    mock: () => mockDeveloper.removeWebhook(id),
    fetch: async () => {
      await api.delete(DEVELOPER_PATHS.webhook(id), WITH_SESSION);
    }
  });

export const getWebhookDeliveries = (id: string): Promise<WebhookDeliveries> =>
  fromSource({
    mock: () => webhookDeliveriesSchema.parse(mockDeveloper.deliveries(id)),
    fetch: async () => webhookDeliveriesSchema.parse((await api.get(DEVELOPER_PATHS.deliveries(id), WITH_SESSION)).data)
  });

export const getOpenApiSpec = (): Promise<OpenApiDocument> =>
  fromSource({
    mock: () => openApiDocumentSchema.parse(mockSpec),
    fetch: async () => openApiDocumentSchema.parse((await api.get(DEVELOPER_PATHS.spec)).data)
  });
