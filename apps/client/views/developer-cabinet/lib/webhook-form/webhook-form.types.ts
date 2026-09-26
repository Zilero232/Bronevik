import type { z } from 'zod';

import type { WEBHOOK_FORM } from '../../config';
import type { webhookFormSchema } from './webhook-form.schemas';

export type WebhookFormValues = z.infer<typeof webhookFormSchema>;

export type WebhookFormError = (typeof WEBHOOK_FORM.errors)[number];

export type WebhookIdFields = Pick<WebhookFormValues, 'accountIds' | 'clanIds'>;

export type WebhookIdField = (typeof WEBHOOK_FORM.idFields)[number];

export type ReportIssueInput = {
  field: WebhookIdField;
  message: WebhookFormError;
};
