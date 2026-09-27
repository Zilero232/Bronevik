import type { WebhookEndpoint } from '@otmetki/schemas';

import { createWebhookEndpointSchema, WEBHOOK } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { isWebhookFormError, parseIdList, toWebhookFilter, toWebhookFormValues, toWebhookInput } from '../webhook-form';
import { webhookFormSchema } from '../webhook-form.schemas';

const VALID = { url: 'https://hooks.example.test/otmetki', events: [WEBHOOK.events[0]], accountIds: '101, 102', clanIds: '' };

const issuesOf = (values: typeof VALID) => {
  const result = webhookFormSchema.safeParse(values);

  return result.success ? [] : result.error.issues.map(({ path, message }) => ({ field: path.join('.'), message }));
};

describe('parseIdList', () => {
  it('accepts commas, spaces, semicolons and new lines and drops duplicates', () => {
    expect(parseIdList('1, 2;3\n4  2')).toEqual([1, 2, 3, 4]);
  });

  it('reads blank input as an empty list, not as an error', () => {
    expect(parseIdList('  ')).toEqual([]);
  });

  it('rejects the whole list when one token is not a positive integer', () => {
    expect(parseIdList('1, abc')).toBeNull();
    expect(parseIdList('0')).toBeNull();
    expect(parseIdList('1.5')).toBeNull();
    expect(parseIdList('-3')).toBeNull();
  });
});

describe('toWebhookFilter', () => {
  it('omits an empty side instead of sending an empty array', () => {
    expect(toWebhookFilter({ accountIds: '7', clanIds: ' ' })).toEqual({ accountIds: [7] });
    expect(toWebhookFilter({ accountIds: '', clanIds: '9' })).toEqual({ clanIds: [9] });
  });
});

describe('webhookFormSchema', () => {
  it('accepts a valid form and turns it into a payload the shared contract accepts', () => {
    expect(issuesOf(VALID)).toEqual([]);
    expect(createWebhookEndpointSchema.safeParse(toWebhookInput({ ...VALID, url: ` ${VALID.url} ` })).success).toBe(true);
  });

  it('flags a malformed id list on its own field', () => {
    expect(issuesOf({ ...VALID, clanIds: 'x1' })).toEqual([{ field: 'clanIds', message: 'ids' }]);
  });

  it('refuses a webhook that follows nobody', () => {
    expect(issuesOf({ ...VALID, accountIds: '', clanIds: '' })).toEqual([{ field: 'accountIds', message: 'filterEmpty' }]);
  });

  it('caps each list at the contract limit', () => {
    const tooMany = Array.from({ length: WEBHOOK.maxFilterIds + 1 }, (_, index) => index + 1).join(',');

    expect(issuesOf({ ...VALID, accountIds: tooMany })).toEqual([{ field: 'accountIds', message: 'filterTooMany' }]);
  });

  it('keeps the shared rules for the URL and the events', () => {
    const fields = issuesOf({ ...VALID, url: 'http://insecure.example.test', events: [] }).map(({ field }) => field);

    expect(fields).toEqual(expect.arrayContaining(['url', 'events']));
  });
});

describe('toWebhookFormValues', () => {
  it('starts a new form empty', () => {
    expect(toWebhookFormValues(null)).toEqual({ url: '', events: [], accountIds: '', clanIds: '' });
  });

  it('round-trips an existing endpoint through the form unchanged', () => {
    const endpoint: WebhookEndpoint = {
      id: '6f1c2a4e-8d3b-4c7a-9e21-3b5f0d8a7c10',
      url: 'https://hooks.example.test/a',
      events: ['mark.gained', 'session.ended'],
      filter: { accountIds: [5, 6], clanIds: [9] },
      isActive: true,
      failureCount: 0,
      disabledAt: null,
      createdAt: '2026-09-01T00:00:00.000Z'
    };

    const { url, events, filter } = endpoint;

    expect(toWebhookInput(toWebhookFormValues(endpoint))).toEqual({ url, events, filter });
  });
});

describe('isWebhookFormError', () => {
  it('recognises only the form’s own message keys', () => {
    expect(isWebhookFormError('filterEmpty')).toBe(true);
    expect(isWebhookFormError('Invalid URL')).toBe(false);
    expect(isWebhookFormError(undefined)).toBe(false);
  });
});
