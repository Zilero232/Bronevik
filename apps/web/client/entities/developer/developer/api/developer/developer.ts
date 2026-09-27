import type { ApiErrorLog, ApiKeys, ApiUsage, DeveloperOverview, WebhookDeliveries, WebhookEndpoints } from '@otmetki/schemas';

import {
  developerControllerDeliveries,
  developerControllerKeyErrors,
  developerControllerKeyUsage,
  developerControllerListKeys,
  developerControllerListWebhooks,
  developerControllerOverview
} from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { ApiKeyUsageInput } from './developer.types';

export const getDeveloperOverview = (): Promise<DeveloperOverview> => fromSdk(() => developerControllerOverview(SESSION_REQUEST));

export const getApiKeys = (): Promise<ApiKeys> => fromSdk(() => developerControllerListKeys(SESSION_REQUEST));

export const getApiKeyUsage = ({ id, days }: ApiKeyUsageInput): Promise<ApiUsage> =>
  fromSdk(() => developerControllerKeyUsage({ ...SESSION_REQUEST, path: { id }, query: { days } }));

export const getApiKeyErrors = (id: string): Promise<ApiErrorLog> =>
  fromSdk(() => developerControllerKeyErrors({ ...SESSION_REQUEST, path: { id } }));

export const getWebhooks = (): Promise<WebhookEndpoints> => fromSdk(() => developerControllerListWebhooks(SESSION_REQUEST));

export const getWebhookDeliveries = (id: string): Promise<WebhookDeliveries> =>
  fromSdk(() => developerControllerDeliveries({ ...SESSION_REQUEST, path: { id } }));
