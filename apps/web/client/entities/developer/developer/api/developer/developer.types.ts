import type { ApiUsageQuery, UpdateWebhookEndpointInput } from '@otmetki/schemas';

export type ApiKeyUsageInput = Partial<ApiUsageQuery> & {
  id: string;
};

export type UpdateWebhookInput = UpdateWebhookEndpointInput & {
  id: string;
};
