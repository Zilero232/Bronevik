import { createWebhookEndpointSchema, WEBHOOK, webhookFilterSchema } from '@bronevik/schemas';
import { z } from 'zod';

import type { WebhookFormError } from './webhook-form.types';

import { parseIdList, toWebhookFilter } from './webhook-form';

const FIELDS = ['accountIds', 'clanIds'] as const;

export const webhookFormSchema = z
  .object({
    url: createWebhookEndpointSchema.shape.url,
    events: createWebhookEndpointSchema.shape.events,
    accountIds: z.string(),
    clanIds: z.string()
  })
  .superRefine((values, context) => {
    const report = (field: (typeof FIELDS)[number], message: WebhookFormError) => context.addIssue({ code: 'custom', path: [field], message });
    const lists = FIELDS.map((field) => ({ field, ids: parseIdList(values[field]) }));

    lists.forEach(({ field, ids }) => {
      if (ids === null) {
        report(field, 'ids');
      } else if (ids.length > WEBHOOK.maxFilterIds) {
        report(field, 'filterTooMany');
      }
    });

    const isListValid = lists.every(({ ids }) => ids !== null && ids.length <= WEBHOOK.maxFilterIds);

    if (isListValid && !webhookFilterSchema.safeParse(toWebhookFilter(values)).success) {
      report('accountIds', 'filterEmpty');
    }
  });
