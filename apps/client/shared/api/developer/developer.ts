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
} from '@otmetki/schemas';

import type { ApiKeyUsageInput, OpenApiDocument, UpdateWebhookInput } from './developer.types';

import {
  developerControllerCreateKey,
  developerControllerCreateWebhook,
  developerControllerDeliveries,
  developerControllerKeyErrors,
  developerControllerKeyUsage,
  developerControllerListKeys,
  developerControllerListWebhooks,
  developerControllerOverview,
  developerControllerRemoveWebhook,
  developerControllerRevokeKey,
  developerControllerUpdateWebhook
} from '../generated';
import { api, SESSION_REQUEST } from '../http';
import { fromSdk, fromServer } from '../source';
import { DEVELOPER_PATHS } from './developer.constants';
import { openApiDocumentSchema } from './developer.schemas';

export const getDeveloperOverview = (): Promise<DeveloperOverview> => fromSdk(() => developerControllerOverview(SESSION_REQUEST));

export const getApiKeys = (): Promise<ApiKeys> => fromSdk(() => developerControllerListKeys(SESSION_REQUEST));

export const createApiKey = (input: CreateApiKeyInput): Promise<CreatedApiKey> =>
  fromSdk(() => developerControllerCreateKey({ ...SESSION_REQUEST, body: input }));

export const revokeApiKey = async (id: string): Promise<void> => {
  await fromSdk(() => developerControllerRevokeKey({ ...SESSION_REQUEST, path: { id } }));
};

export const getApiKeyUsage = ({ id, days }: ApiKeyUsageInput): Promise<ApiUsage> =>
  fromSdk(() => developerControllerKeyUsage({ ...SESSION_REQUEST, path: { id }, query: { days } }));

export const getApiKeyErrors = (id: string): Promise<ApiErrorLog> =>
  fromSdk(() => developerControllerKeyErrors({ ...SESSION_REQUEST, path: { id } }));

export const getWebhooks = (): Promise<WebhookEndpoints> => fromSdk(() => developerControllerListWebhooks(SESSION_REQUEST));

export const createWebhook = (input: CreateWebhookEndpointInput): Promise<CreatedWebhookEndpoint> =>
  fromSdk(() => developerControllerCreateWebhook({ ...SESSION_REQUEST, body: input }));

export const updateWebhook = ({ id, ...patch }: UpdateWebhookInput): Promise<WebhookEndpoint> =>
  fromSdk(() => developerControllerUpdateWebhook({ ...SESSION_REQUEST, path: { id }, body: patch }));

export const removeWebhook = async (id: string): Promise<void> => {
  await fromSdk(() => developerControllerRemoveWebhook({ ...SESSION_REQUEST, path: { id } }));
};

export const getWebhookDeliveries = (id: string): Promise<WebhookDeliveries> =>
  fromSdk(() => developerControllerDeliveries({ ...SESSION_REQUEST, path: { id } }));

export const getOpenApiSpec = (): Promise<OpenApiDocument> =>
  fromServer(async () => openApiDocumentSchema.parse((await api.get(DEVELOPER_PATHS.spec)).data));
