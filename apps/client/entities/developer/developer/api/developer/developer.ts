import type { ApiErrorLog, ApiKeys, ApiUsage, DeveloperOverview, WebhookDeliveries, WebhookEndpoints } from '@otmetki/schemas';

import {
  developerControllerDeliveries,
  developerControllerKeyErrors,
  developerControllerKeyUsage,
  developerControllerListKeys,
  developerControllerListWebhooks,
  developerControllerOverview
} from '@/shared/api/generated';
import { api, SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk, fromServer } from '@/shared/api/source';

import type { ApiKeyUsageInput, OpenApiDocument } from './developer.types';

import { DEVELOPER_PATHS } from './developer.constants';
import { openApiDocumentSchema } from './developer.schemas';

export const getDeveloperOverview = (): Promise<DeveloperOverview> => fromSdk(() => developerControllerOverview(SESSION_REQUEST));

export const getApiKeys = (): Promise<ApiKeys> => fromSdk(() => developerControllerListKeys(SESSION_REQUEST));

export const getApiKeyUsage = ({ id, days }: ApiKeyUsageInput): Promise<ApiUsage> =>
  fromSdk(() => developerControllerKeyUsage({ ...SESSION_REQUEST, path: { id }, query: { days } }));

export const getApiKeyErrors = (id: string): Promise<ApiErrorLog> =>
  fromSdk(() => developerControllerKeyErrors({ ...SESSION_REQUEST, path: { id } }));

export const getWebhooks = (): Promise<WebhookEndpoints> => fromSdk(() => developerControllerListWebhooks(SESSION_REQUEST));

export const getWebhookDeliveries = (id: string): Promise<WebhookDeliveries> =>
  fromSdk(() => developerControllerDeliveries({ ...SESSION_REQUEST, path: { id } }));

export const getOpenApiSpec = (): Promise<OpenApiDocument> =>
  fromServer(async () => openApiDocumentSchema.parse((await api.get(DEVELOPER_PATHS.spec)).data));
