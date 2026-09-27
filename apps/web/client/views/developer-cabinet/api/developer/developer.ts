import type { CreateApiKeyInput, CreatedApiKey, CreatedWebhookEndpoint, CreateWebhookEndpointInput, WebhookEndpoint } from '@otmetki/schemas';

import type { UpdateWebhookInput } from '@/entities/developer/developer';

import {
  developerControllerCreateKey,
  developerControllerCreateWebhook,
  developerControllerRemoveWebhook,
  developerControllerRevokeKey,
  developerControllerUpdateWebhook
} from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const createApiKey = (input: CreateApiKeyInput): Promise<CreatedApiKey> =>
  fromSdk(() => developerControllerCreateKey({ ...SESSION_REQUEST, body: input }));

export const revokeApiKey = async (id: string): Promise<void> => {
  await fromSdk(() => developerControllerRevokeKey({ ...SESSION_REQUEST, path: { id } }));
};

export const createWebhook = (input: CreateWebhookEndpointInput): Promise<CreatedWebhookEndpoint> =>
  fromSdk(() => developerControllerCreateWebhook({ ...SESSION_REQUEST, body: input }));

export const updateWebhook = ({ id, ...patch }: UpdateWebhookInput): Promise<WebhookEndpoint> =>
  fromSdk(() => developerControllerUpdateWebhook({ ...SESSION_REQUEST, path: { id }, body: patch }));

export const removeWebhook = async (id: string): Promise<void> => {
  await fromSdk(() => developerControllerRemoveWebhook({ ...SESSION_REQUEST, path: { id } }));
};
