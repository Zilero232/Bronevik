import type { WebhookStatus, WebhookStatusInput } from './webhook-status.types';

export const webhookStatus = ({ isActive, disabledAt }: WebhookStatusInput): WebhookStatus => {
  if (isActive) {
    return 'active';
  }

  return disabledAt === null ? 'paused' : 'disabled';
};
