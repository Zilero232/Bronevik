import type { CreateWebhookEndpointInput, WebhookEndpoint, WebhookFilter } from '@bronevik/schemas';

import { unique } from 'remeda';

import type { WebhookFormError, WebhookFormValues, WebhookIdFields } from './webhook-form.types';

import { WEBHOOK_FORM } from './webhook-form.constants';

export const parseIdList = (text: string): number[] | null => {
  const ids = text.split(WEBHOOK_FORM.separator).filter(Boolean).map(Number);

  return ids.every((id) => Number.isSafeInteger(id) && id > 0) ? unique(ids) : null;
};

export const toWebhookFilter = ({ accountIds, clanIds }: WebhookIdFields): WebhookFilter => {
  const accounts = parseIdList(accountIds) ?? [];
  const clans = parseIdList(clanIds) ?? [];

  return {
    ...(accounts.length > 0 && { accountIds: accounts }),
    ...(clans.length > 0 && { clanIds: clans })
  };
};

export const toWebhookInput = ({ url, events, ...ids }: WebhookFormValues): CreateWebhookEndpointInput => ({
  url: url.trim(),
  events,
  filter: toWebhookFilter(ids)
});

export const toWebhookFormValues = (endpoint: WebhookEndpoint | null): WebhookFormValues => {
  if (!endpoint) {
    return { ...WEBHOOK_FORM.empty, events: [] };
  }

  const { url, events, filter } = endpoint;

  return { url, events, accountIds: (filter.accountIds ?? []).join(', '), clanIds: (filter.clanIds ?? []).join(', ') };
};

export const isWebhookFormError = (message: string | undefined): message is WebhookFormError =>
  new Set<string>(WEBHOOK_FORM.errors).has(message ?? '');
