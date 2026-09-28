'use client';

import type { WebhookEndpoint } from '@otmetki/schemas';

import { useMutation } from '@tanstack/react-query';

import { updateWebhook } from '../../../api';
import { WEBHOOK_QUERIES } from '../../../config';
import { webhookStatus } from '../../../lib/webhook-status';

export const useWebhookRow = (endpoint: WebhookEndpoint) => {
  const update = useMutation({
    mutationFn: updateWebhook,
    meta: { successKey: 'developer.toast.webhookUpdated', errorKey: 'developer.toast.failed', invalidates: WEBHOOK_QUERIES.invalidates }
  });

  return {
    status: webhookStatus(endpoint),
    onActiveChange: (isActive: boolean) => update.mutate({ id: endpoint.id, isActive })
  };
};
